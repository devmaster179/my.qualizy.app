<template>
    <div class="typing">
    </div>
    
</template>

<style scoped>
.typing,
.typing:before,
.typing:after {
  border-radius: 50%;
  width: 1em;
  height: 1em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.typing {
  color: #ffffff;
  font-size: 10px;
  /* margin: 80px auto; */
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.typing:before,
.typing:after {
  content: '';
  position: absolute;
  top: 0;
}
.typing:before {
  left: -1em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.typing:after {
  left: 1em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 1em 0 -0.5em;
  }
  40% {
    box-shadow: 0 1em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 1em 0 -0.5em;
  }
  40% {
    box-shadow: 0 1em 0 0;
  }
}

</style>