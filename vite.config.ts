import { ManifestOptions, VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const manifest : Partial<ManifestOptions> = {
    "short_name": "Pawana",
    "start_url": "/",
    "description": "Solusi pemantauan dan pendukung keputusan tentang kualitas udara dan emisi gas rumah kaca.",
    "prefer_related_applications" : true,
    "name": "Pawana",
    "theme_color": "#378CE7",
    "background_color": "#378CE7",
    "icons": [
        {
            "purpose": "maskable any",
            "sizes": "48x48",
            "src": "icons/maskable_icon_x48.png",
            "type": "image/png"
        },
        {
            "purpose": "maskable any",
            "sizes": "72x72",
            "src": "icons/maskable_icon_x72.png",
            "type": "image/png"
        },
        {
            "purpose": "maskable any",
            "sizes": "96x96",
            "src": "icons/maskable_icon_x96.png",
            "type": "image/png"
        },
        {
            "purpose": "maskable any",
            "sizes": "128x128",
            "src": "icons/maskable_icon_x128.png",
            "type": "image/png"
        },
        {
            "purpose": "maskable any",
            "sizes": "192x192",
            "src": "icons/maskable_icon_x192.png",
            "type": "image/png"
        },
        {
            "purpose": "maskable any",
            "sizes": "384x384",
            "src": "icons/maskable_icon_x384.png",
            "type": "image/png"
        },
        {
            "purpose": "maskable any",
            "sizes": "512x512",
            "src": "icons/maskable_icon_x512.png",
            "type": "image/png"
        }
    ],
    "orientation": "any",
    "display": "standalone",
    "dir": "ltr",
    "lang": "en-US"
}



// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			},
			manifest : manifest, 
			manifestFilename : 'manifest.json'
		})
	],

	build: {
		rollupOptions: {
			input: {
				app: '/index.app.html',
				login: '/index.login.html',
				verify: '/index.verify.html',
			},
			// plugins: [
			// 	{
			// 		name: 'custom-html-paths',
			// 		generateBundle(_, bundle) {
			// 			const htmlFileMapping: Record<string, string> = {
			// 				'src/index.app.html': 'index.html',
			// 				'src/index.login.html': 'login/index.html',
			// 				'src/index.verify.html': 'verify/index.html',
			// 			};

			// 			console.log(_)
			// 			console.log(bundle)
			// 			// for (const [fileName, outputItem] of Object.entries(bundle)) {
			// 			// 	const gg = 
			// 			// 	if (htmlFileMapping[fileName]) {
			// 			// 		outputItem.fileName = htmlFileMapping[fileName];
			// 			// 	}
			// 			// }
			// 		},
			// 	}
			// ]
		}
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	},
	server: {
	}
})
