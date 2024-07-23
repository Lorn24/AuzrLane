<script setup>
import { loadFull } from 'tsparticles' // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadSlim } from 'tsparticles-slim' // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
const particlesInit = async (engine) => {
  await loadFull(engine)
  // await loadSlim(engine)
}

const particlesLoaded = async (container) => {
  console.log('Particles container loaded', container)
}
</script>

<template>
  <div>
    <vue-particles
      id="tsparticles"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
      :options="{
        background: {
          color: {
            value: '#101010'
          }
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'grab'
            },
            onHover: {
              enable: true,
              mode: 'repulse'
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40
            },
            push: {
              quantity: 4
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            grab: {
              distance: 500
            }
          }
        },
        particles: {
          color: {
            value: '#ffffff'
          },
          links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 6,
            straight: false
          },
          //数量
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 120
          },
          opacity: {
            value: 0.5
          },
          shape: {
            type: 'circle'
          },
          size: {
            random: true,
            value: 5
          }
        },
        detectRetina: true
      }"
    />
    <el-container>
      <el-main>
        <ul class="homeul">
          <el-scrollbar height="640px">
            <li class="homeli">
              <h3 justify="center" @click="$router.push('/catalogue')">
                AzurLane
              </h3>
            </li>
            <li class="homeli">
              <h3 justify="center" @click="$router.push('/alLive2d')">
                Live2d-AzurLane
              </h3>
            </li>
            <li class="homeli">
              <h3
                justify="center"
                @click="$router.push('/three-background')"
              >
                ThreeBackgound
              </h3>
            </li>
          </el-scrollbar>
        </ul>
      </el-main>
      <el-footer> </el-footer>
    </el-container>
  </div>
</template>

<style>
.homeul {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
}
.homeli {
  position: relative;
  height: 200px;
  width: 40vw;
  background-color: #101010;
  border-top: 4px solid #9a9a9a;
  opacity: 0.7;
  z-index: 1;
  cursor: pointer;
}
.homeli h3 {
  font-size: 40px;
  color: #9a9a9a;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: all 0.3s;
}
.homeli h3:hover {
  font-size: 45px;
  color: #e7e8eb;
}
</style>
