import { useMemo } from "react";
import { Float } from "@react-three/drei";
import { projectsData } from "../../content/profile";

interface ProjectWorldSceneProps {
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
}

export default function ProjectWorldScene({ activeProjectIndex, onSelectProject }: ProjectWorldSceneProps) {
  const stations = useMemo(() => {
    return projectsData.map((project, i) => {
      const angle = (i / projectsData.length) * Math.PI * 2;
      const radius = 4.2;
      const x = Math.cos(angle) * radius;
      const z = -12.0 + Math.sin(angle) * radius * 0.5;
      return { project, index: i, x, z };
    });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {stations.map(({ project, index, x, z }) => {
        const isActive = activeProjectIndex === index;
        return (
          <Float key={project.id} speed={1.0 + index * 0.2} floatIntensity={0.3}>
            <group
              position={[x, 0.5, z]}
              onClick={() => onSelectProject(index)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "default";
              }}
            >
              {/* Station Visual Primitive Motif */}
              <mesh>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshStandardMaterial
                  color={isActive ? "#f5c56d" : "#3fd5f4"}
                  emissive={isActive ? "#8a5314" : "#0b5e7b"}
                  emissiveIntensity={isActive ? 2.5 : 1.2}
                  wireframe
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>

              {/* Station Inner Core Node */}
              <mesh scale={0.4}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                  color={isActive ? "#f5c56d" : "#3fd5f4"}
                  emissive={isActive ? "#f5c56d" : "#3fd5f4"}
                  emissiveIntensity={2.0}
                />
              </mesh>

              {/* Spotlight for Station */}
              <spotLight
                position={[0, 3, 0]}
                color={isActive ? "#f5c56d" : "#3fd5f4"}
                intensity={isActive ? 4.0 : 1.5}
                distance={6}
              />
            </group>
          </Float>
        );
      })}
    </group>
  );
}
