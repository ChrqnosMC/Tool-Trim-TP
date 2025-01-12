import { writeFile, mkdir } from 'fs/promises'

const trims = [
  'sentry',
  'vex',
  'wild',
  'coast',
  'dune',
  'wayfinder',
  'raiser',
  'shaper',
  'host',
  'ward',
  'silence',
  'tide',
  'snout',
  'rib',
  'eye',
  'spire',
  'flow',
  'bolt'
]

const tools = [
  'netherite_axe',
  'diamond_axe',
  'golden_axe',
  'iron_axe',
  'stone_axe',
  'wooden_axe',
  'netherite_pickaxe',
  'diamond_pickaxe',
  'golden_pickaxe',
  'iron_pickaxe',
  'stone_pickaxe',
  'wooden_pickaxe',
  'netherite_shovel',
  'diamond_shovel',
  'golden_shovel',
  'iron_shovel',
  'stone_shovel',
  'wooden_shovel',
  'netherite_hoe',
  'diamond_hoe',
  'golden_hoe',
  'iron_hoe',
  'stone_hoe',
  'wooden_hoe',
  'netherite_sword',
  'diamond_sword',
  'golden_sword',
  'iron_sword',
  'stone_sword',
  'wooden_sword'
]

const materials = [
  'quartz',
  'iron',
  'netherite',
  'redstone',
  'copper',
  'gold',
  'emerald',
  'diamond',
  'lapis',
  'amethyst',
  'resin'
]

function compareMaterial(material1: string, material2: string) {
  if (material1.startsWith('gold') && material2.startsWith('gold')) return true
  return material1 === material2
}

async function writeItemModels() {
  const promises: Promise<void>[] = []
  
  await mkdir(`./generator/output/assets/minecraft/items`, { recursive: true })

  for (const tool of tools) {
    let [toolMaterial, toolName] = tool.split('_')

    if (!toolName) {
      toolName = toolMaterial
      toolMaterial = ''
    }
    
    const customModelDataCases: { model: { type: string, property: string, fallback: { type: string, model: string }, cases: any[] }, threshold: number }[] = []
    let counter = 1

    for (const trim of trims) {
      const trimMaterialCases: { model: { type: string, model: string }, when: string }[] = []

      for (const [, material] of materials.entries()) {
        const model = compareMaterial(material, toolMaterial)
          ? `tool_trim:item/${tool}_${trim}_and_${material}_darker_trim`
          : `tool_trim:item/${tool}_${trim}_and_${material}_trim`
        trimMaterialCases.push({
          model: {
            type: `minecraft:model`,
            model
          },
          when: `minecraft:${material}`
        })
      }

      customModelDataCases.push({
        model: {
          type: `minecraft:select`,
          cases: trimMaterialCases,
          fallback: {
            type: `minecraft:model`,
            model: `minecraft:item/${tool}`
          },
          property: `minecraft:trim_material`
        },
        threshold: counter++
      })
    }

    const toolFile = `./generator/output/assets/minecraft/items/${tool}.json`
    const toolContents = {
      model: {
        type: 'minecraft:range_dispatch',
        entries: customModelDataCases,
        fallback: {
          type: `minecraft:model`,
          model: `minecraft:item/${tool}`
        },
        property: `minecraft:custom_model_data`
      }
    }
    promises.push(writeFile(toolFile, JSON.stringify(toolContents, null, 2)))
  }

  return Promise.all(promises)
}

writeItemModels()