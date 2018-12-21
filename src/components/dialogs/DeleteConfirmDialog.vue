<template>
	<div>
		<div class="dialog-cover" @click="closeMe" v-if="ifShowMe">
		</div>
		<transition name="drop">
			<div class="dialog-content" v-if="ifShowMe">
				<p class="dialog-close" @click="closeMe">
					<span class="glyphicon glyphicon-share" aria-hidden="true"></span>
				</p>
				<slot>empty here if you cant see the slot</slot>
				<!-- <slot>empty here if you cant see the slot </slot> -->
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		props: {
			ifShowMe: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {

			};
		},
		methods: {
			closeMe() {
				//向上激活一个自定义event
				this.$emit('on-close')
			},
		}
	}
</script>

<style>
	.drop-enter-active {
		transition: all .5s ease;
	}

	.drop-leave-active {
		transition: all .3s ease;
	}

	.drop-enter {
		transform: translateY(-300px);
	}

	.drop-leave-active {
		transform: translateY(-300px);
	}

	.dialog-cover {
		background: #000;
		opacity: .3;
		position: fixed;
		z-index: 5;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.dialog-content {
		width: 30%;
		position: fixed;
		max-height: 80%;
		overflow: auto;
		background: #fff;
		top: 20%;
		left: 60%;
		margin-left: -25%;
		z-index: 10;
		border: 2px solid #464068;
		padding: 2%;
		line-height: 1.6;
		text-align: left;
	}

	.dialog-close {
		float: right;
		position: absolute;
		right: 25px;
		top: 10px;
		font-size: 20pt;
		font-family: "Consolas";
	}
</style>
