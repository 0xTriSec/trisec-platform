interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'DragonflyX',
    description: `DragonflyX is a network scanning and reconnaissance tool designed for cybersecurity professionals and enthusiasts. It helps identify open ports, running services, and potential vulnerabilities in network infrastructure.`,
    imgSrc: '/static/images/dragonflyx_project.png',
    href: 'https://github.com/0xTriSec/DragonflyX',
  },
]

export default projectsData
