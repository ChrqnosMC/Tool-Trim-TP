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
  'amethyst'
]

function compareMaterial(material1: string, material2: string) {
  if (material1.startsWith('gold') && material2.startsWith('gold')) return true
  return material1 === material2
}

async function writeItemModels() {
  const promises: Promise<void>[] = []
  
  await mkdir(`./generator/output/assets/minecraft/models/item`, { recursive: true })

  for (const tool of tools) {
    let [toolMaterial, toolName] = tool.split('_')

    if (!toolName) {
      toolName = toolMaterial
      toolMaterial = ''
    }
    
    const overrides: { model: string, predicate: { custom_model_data: number } }[] = []
    let counter = 1

    for (const trim of trims) {
      for (const material of materials) {
        const model = compareMaterial(material, toolMaterial)
          ? `tool_trim:item/${tool}_${trim}_and_${material}_darker_trim`
          : `tool_trim:item/${tool}_${trim}_and_${material}_trim`
        overrides.push({
          model,
          predicate: { custom_model_data: counter++ }
        })
      }
    }

    const toolFile = `./generator/output/assets/minecraft/models/item/${tool}.json`
    const toolContents = {
      parent: 'minecraft:item/handheld',
      textures: {
        layer0: `minecraft:item/${tool}`
      },
      overrides
    }
    promises.push(writeFile(toolFile, JSON.stringify(toolContents, null, 2)))
  }

  return Promise.all(promises)
}

writeItemModels()