<script lang='ts' setup>
console.log(import.meta.env.__UNO__)
console.log(import.meta.env.__UNO_THEME__)

const css = 'text-white'

console.log((import.meta.env.__UNO__))
console.log(Object.keys(import.meta.env.__UNO__))
</script>

<template>
  <div class="text-white">
    111
  </div>
</template>

<style>
html, body{
  background-color: #222;
}
</style>
