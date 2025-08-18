<template>
	<div class="app">
		<router-view />
	</div>
</template>

<script setup lang="ts">
</script>

<style>
html, body, #app {
	margin: 0;
	height: 100%;
	width: 100%;
}
.app {
	height: 100%;
	width: 100%;
	background: #0f1020;
	color: #f0f3ff;
	font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
}
a { color: #7ccfff; }
button { cursor: pointer; }
</style>

