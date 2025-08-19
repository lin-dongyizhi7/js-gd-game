<!--
 * @Author: 凛冬已至 2985956026@qq.com
 * @Date: 2025-08-18 15:58:59
 * @LastEditors: 凛冬已至 2985956026@qq.com
 * @LastEditTime: 2025-08-19 09:52:07
 * @FilePath: \js-gd-game\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="app">
		<router-view />
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="less">
html, body, #app {
	margin: 0;
	height: 100vh;
	width: 100%;
}

.app {
	height: 99%;
	width: 100%;
	background: #0f1020;
	color: #f0f3ff;
	font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
}

a {
	color: #7ccfff;
}

button {
	cursor: pointer;
}
</style>

