## 🚀 **To-Do-List:**

### **Tecnologías utilizadas:**

- ⚙️ **Angular 20** con standalone components
- 📱 **Ionic 8** con componentes nativos y navegación móvil
- 🔄 **RxJS** para manejo de datos reactivos
- 🛡️ **TypeScript** para type safety y desarrollo robusto
- 🎨 **SCSS** para estilos avanzados y personalizados
- 🧪 **Testing** con Angular 20


### 🧱 Estructura de la aplicación
```bash
src/
├── app/
│ ├── pages/
│ │ ├── home/ ← Página principal con lista y creacion de tareas
│ │ └── categories/ ← Configuracion de categorias
│ ├── components/
│ │ └── task-card/ ← Componente reutilizable de card
│ │ └── loading/ ← Componente reutilizable de loading
│ ├── services/
│ │ └── storage.service.ts ← abstract service de storage
│ │ └── task.service.ts ← service de tareas
│ │ └── category.service.ts ← service de categorias
│ │ └── remote-config.service.ts ← service de integracion de firebase remote config
│ ├── models/
│ │ └── task.model.ts ← Tipado con interfaces TypeScript para tareas
│ │ └── category.model.ts ← Tipado con interfaces TypeScript para categorias
```

### **Características:**

- **Navegación nativa** de Ionic
- **Componentes standalone** de Angular 20
- **Servicios reactivos** con RxJS
- **Animaciones fluidas** con CSS y Ionic
- **Manejo de errores** robusto



### **Funcionalidades implementadas:**

- ✅ **Splash screen** 
- ✅ **Lista de tareas**
- ✅ **Página de configuracion de categorias**
- ✅ **Firebase Remote Config para habilitar categorias**
- ✅ **Estados de carga** y manejo de errores
- ✅ **Componentes reutilizables** y modulares

## 🧪 Testing

Esta app utiliza el sistema de pruebas de Angular 20:

Para ejecutar los tests:

```bash
npm run test
```
📦 Instalación y ejecución
Clona el repositorio:

```bash
git clone https://github.com/japa-spk/to-do-list.git
cd to-do-list
```

Instala dependencias:

```bash
npm install
```

Ejecuta en navegador o dispositivo:

```bash
ionic serve      # Navegador
ionic cap run android -l --external  # Dispositivo Android
```

🔧 Build APK (Android)

Construir Proyecto
```bash
ionic build
```
Anadir plataforma, si no existe
```bash
ionic cap add android
```
Sincronizar cambios
```bash
ionic cap sync android
```
Genera los assets:
```bash
npx capacitor-assets generate
```

Abre el proyecto en Android Studio:

```bash
npx cap open android
```

Desde Android Studio → Build → Generate Signed APK o usa:

```bash
cd android
./gradlew assembleDebug
```

## Respuestas a Preguntas
### ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?
Uno de los principales desafíos fue integrar **Firebase Remote Config** para habilitar dinámicamente las categorías, asegurando que los cambios se reflejaran en tiempo real sin afectar la experiencia del usuario. Además, implementar **animaciones fluidas** con CSS e Ionic requirió ajustar detalles para garantizar una experiencia visual consistente en diferentes dispositivos. Otro reto fue diseñar componentes reutilizables y modulares, como `task-card` y `loading`, para mantener la coherencia en toda la aplicación.

### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
- Lazy Loading: Se utilizó para cargar las páginas de manera diferida, reduciendo el tiempo de carga inicial de la aplicación.
- Uso de servicios reactivos con RxJS: Esto permitió manejar eficientemente los flujos de datos y minimizar el impacto en el rendimiento al trabajar con tareas y categorías.
- Optimización de assets: Se generaron assets optimizados con npx capacitor-assets generate para reducir el tamaño de los recursos gráficos.
### ¿Cómo aseguraste la calidad y mantenibilidad del código?
- Pruebas unitarias: Se utilizó el sistema de pruebas de Angular 20 (npm run test) para validar la funcionalidad de los servicios y componentes.
- Estructura modular: La organización del código en servicios (`task.service.ts`, `category.service.ts`) y modelos (`task.model.ts`, `category.model.ts`) facilitó la mantenibilidad y escalabilidad.
- Linting y estándares de código: Se configuró ESLint (`.eslintrc.json`) para garantizar un código limpio y consistente.
- Documentación: Se incluyó una descripción clara de la estructura y funcionalidades en el README.md para facilitar la colaboración y el mantenimiento futuro.

## Optimizaciones
- Optimizar el loader: Ajustar el estado del loader (`this.loading`) para que se maneje correctamente antes y después de cargar los datos.
- Desuscribirse correctamente: Usar `takeUntil(this.destroy$)` para garantizar que las suscripciones se cancelen cuando el componente se destruya.
- Explicación del ngOnInit: Detallar cómo se manejan los datos y el flujo reactivo.
```typescript
ngOnInit() {
  // Inicializamos el loader
  this.loading = true;

  // Combinamos múltiples observables para manejar tareas, estadísticas y categorías
  combineLatest([
    this.taskService.tasks$, // Observable de tareas
    this.taskService.getTaskStats(), // Observable de estadísticas de tareas
    this.categoryService.categories$, // Observable de categorías
    this.selectedCategoryFilter$ // Observable del filtro de categoría seleccionada
  ])
    .pipe(
      takeUntil(this.destroy$), // Nos aseguramos de desuscribirnos al destruir el componente
      map(([tasks, stats, categories, filter]) => {
        // Filtrar tareas por categoría seleccionada
        console.log('Selected category filter:', filter);
        if (filter !== "all") {
          tasks = tasks.filter(task => task.categoryId === filter);
        }
        return { tasks, stats, categories };
      })
    )
    .subscribe(({ tasks, stats, categories }) => {
        // Actualizamos los datos del componente
        this.tasks = tasks;
        this.completedCount = stats.completed;
        this.totalCount = stats.total;
        this.categories = categories;
        this.loading = false; // Desactivamos el loader
        console.log('Data loaded:', { tasks, stats, categories });
    });
}

ngOnDestroy() {
  // Emitimos un valor para completar todos los observables que dependen de destroy$
  this.destroy$.next();
  this.destroy$.complete();
}
```
### Explicación:
- ngOnInit:
    - Se inicializa el loader (`this.loading = true`) para indicar que los datos están cargándose.
    - Se combinan múltiples observables (`combineLatest`) para manejar tareas, estadísticas, categorías y el filtro seleccionado.
    - Se utiliza `map` para filtrar las tareas según la categoría seleccionada.
    - En el `subscribe`, se actualizan las propiedades del componente (`tasks`, `completedCount`, `totalCount`, `categories`) y se desactiva el loader (`this.loading = false`).
- ngOnDestroy:
    - Se emite un valor en `this.destroy$` y se completa el `Subject` para cancelar todas las suscripciones activas, evitando fugas de memoria.
    - Con estos cambios, el componente es más eficiente en el uso de memoria y asegura que el loader se maneje correctamente en todos los casos.

## Integración con Firebase Remote Config

Se ha integrado Firebase Remote Config para habilitar o deshabilitar dinámicamente la funcionalidad de categorías en las tareas.

#### Configuración
1. Asegúrate de haber configurado Firebase en tu proyecto.
2. En la consola de Firebase, ve a **Remote Config** y crea un parámetro llamado `enable_categories` con un valor booleano (`true` o `false`).

#### Uso
- Si `enable_categories` es `true`, las categorías estarán habilitadas y se podrán filtrar las tareas por categoría.
- Si `enable_categories` es `false`, las categorías estarán deshabilitadas y no se mostrarán en la interfaz.

#### Implementación
En el componente `home.page.ts`, se utiliza el servicio `RemoteConfig` para obtener el valor de `enable_categories` y condicionar la funcionalidad de categorías:

```typescript
await this.remoteConfigService.load();
this.categoriesEnabled = await this.remoteConfigService.getFeatureFlagValue('enable_categories');
```