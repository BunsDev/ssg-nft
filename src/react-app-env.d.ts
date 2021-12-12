/// <reference types="react-scripts" />

interface Window {
    ethereum: any;
}

declare module "*.svg" {
    const content: any;
    export default content;
}