import { Group, GridHelper, HemisphereLight, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import type { SceneKey } from '../types'

export function createSceneGroup(key: SceneKey): Group {
  const group = new Group()
  // 地面
  const plane = new Mesh(new PlaneGeometry(40, 20), new MeshBasicMaterial({ color: 0x111416 }))
  plane.rotation.x = -Math.PI / 2
  group.add(plane)
  // 网格
  const grid = new GridHelper(40, 40, 0x444444, 0x222222)
  group.add(grid)
  // 天光
  const hemi = new HemisphereLight(0xffffff, 0x222233, 1.0)
  group.add(hemi)

  // 可根据 key 添加不同的装饰，这里先留空

  return group
}


