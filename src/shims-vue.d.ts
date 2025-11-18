// Tipos para componentes .vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Tipos para importar archivos .css (como ./assets/tailwind.css)
declare module '*.css';

