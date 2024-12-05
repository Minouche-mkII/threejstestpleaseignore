import * as THREE from 'three';

const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;
const DEFAULT_MAX_FPS = 24;
const DEFAULT_SIMULATION_SPEED = 24;

export class Application {
    
    camera : THREE.Camera;
    private scene : THREE.Scene;
    private renderer : THREE.WebGLRenderer;

    private timeToWaitBeetweenFrames: number;
    private simulationSpeed : number;

    private started : boolean;
    private behaviors : Map<Function, Function>;

    constructor(canvaId : string) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth/window.innerHeight, NEAR, FAR);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#scene')!
        });

        this.started = false;

        this.timeToWaitBeetweenFrames = 0;
        this.simulationSpeed = 0;
        this.setFps(DEFAULT_MAX_FPS);
        this.setSimulationSpeed(DEFAULT_SIMULATION_SPEED)
        this.behaviors = new Map();
    }

    setFps(maxFps: number) : void {
        this.timeToWaitBeetweenFrames = 1000/maxFps;
    }

    setSimulationSpeed(updatePerSecond: number) {
        this.simulationSpeed = 1000/updatePerSecond;
    }

    addBehavior(delegate: Function) {
        this.behaviors.set(delegate, delegate)
        console.log(this.behaviors);
    }

    removeBehavior(delegate: Function) {
        this.behaviors.delete(delegate);
    }

    private render () : void {
        var lastFrame = new Date().valueOf();

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
        
        var timePassed = (new Date().valueOf()) - lastFrame;
        setTimeout(() => {
            requestAnimationFrame(() => {this.render()})
        }, this.timeToWaitBeetweenFrames - timePassed);
    }

    private physicsLoop() {
        var lastFrame = new Date().valueOf();
        
        this.behaviors.forEach((value) => value());

        var timePassed = (new Date().valueOf()) - lastFrame;
        setTimeout(() => {
            this.physicsLoop()
        }, this.simulationSpeed - timePassed);
    }

    start() : void {
        if(!this.started) {
            this.render();
            this.physicsLoop();
            this.started = true;
        }
    }

    getScene () {
        return this.scene;
    }
}
