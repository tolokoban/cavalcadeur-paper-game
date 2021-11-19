import React from 'react'
import ReactDOM from 'react-dom'
import SnapshotFeatureInterface from '../contract/feature/snapshot'
import {
    makeBackendAllocatorService,
    makeBackendService,
    makeCameraManager,
    makeGeometry,
    makeHelpManager,
    makeScalebarPainter,
    makeSceneManager,
    makeSceneViewManager,
    makeSimulationManager,
    makeSnapshotFeature
} from '../factory/global'
import Modal from '../ui/modal'
import AppView from '../view/app'
import './app.css'

const EXPORT = { start }

async function start() {
    try {
        const progress = document.getElementById('splash-screen-progress')
        if (!progress)
            throw Error(
                'missing mandatory DIV with ID "splash-screen-progress"!'
            )
        progress.textContent = ''
        const allocator = makeBackendAllocatorService()
        const backendAddress = await allocator.allocate({
            onProgress(message) {
                progress.textContent = message
            },
        })
        if (!backendAddress) {
            progress.textContent = "Waiting for redirect..."
            return
        }
        
        const backend = makeBackendService(backendAddress)
        const onProgress = (arg: { value: number; label?: string }) => {
            const { label } = arg
            if (!label) return

            progress.textContent = label
        }
        progress.textContent = `Initializing...`
        await backend.initialize(onProgress)

        // Entry point for our app
        const braynsAddress = backend.mainBraynsAddress
        const sceneView = await makeSceneViewManager(braynsAddress)
        sceneView.setViewportConstraint(true)
        progress.textContent = `Initalize Simulation Manager...`
        const simulationManager = makeSimulationManager(braynsAddress)
        await simulationManager.initialize()
        const snapshotFeature = makeSnapshotFeature(braynsAddress)
        const helpManager = makeHelpManager()
        const root = document.getElementById('root') as HTMLElement
        ReactDOM.render(
            <AppView
                camera={await makeCameraManager(braynsAddress)}
                geometry={makeGeometry()}
                help={helpManager}
                scene={makeSceneManager(backend)}
                sceneView={sceneView}
                simulation={simulationManager}
                onConfigClick={() => {
                    void handleSnapshotClick(snapshotFeature)
                }}
                scalebarPainter={makeScalebarPainter()}
            />,
            root
        )
    } catch (ex) {
        console.error('Unable to start:', ex)
        await Modal.error(
            <div>
                <h1>Unable to start!</h1>
                {typeof ex === 'string' ? (
                    <code>{`${ex}`}</code>
                ) : (
                    <pre>{JSON.stringify(ex, null, '  ')}</pre>
                )}
            </div>
        )
        const params = new URLSearchParams(window.location.search)
        params.delete('host')
        window.location.search = `?${params.toString()}`
    }
}

async function handleSnapshotClick(feature: SnapshotFeatureInterface) {
    await feature.takeInteractiveSnapshot()
}

export default EXPORT
