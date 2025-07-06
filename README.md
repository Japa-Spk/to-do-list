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
