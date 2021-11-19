import * as React from "react"
import Button from "../../ui/view/button"
import Checkbox from "../../ui/view/checkbox"
import "./scene-menu-view.css"


export interface SceneMenuViewProps {
    className?: string
    onSnapshotClick(this: void): void
    onClose(): void
}

export default function SceneMenuView(props: SceneMenuViewProps) {
    const close = (handler: () => void) => {
        props.onClose()
        handler()
    }
    return (
        <div className={getClassNames(props)}>
            <Button
                wide={true}
                icon="snapshot"
                label="Take a snapshot"
                onClick={() => close(props.onSnapshotClick)}
            />
            <fieldset>
                <legend>Camera</legend>
                <Button
                    wide={true}
                    icon="camera"
                    label="Switch to ORTHOGRAPHIC"
                />
                <Checkbox
                    wide={true}
                    label="Show camera control widget"
                    value={false}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
                />
                <Checkbox
                    wide={true}
                    label="Focus on whole scene"
                    value={false}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
                />
            </fieldset>
            <fieldset>
                <legend>Light</legend>
                <Button wide={true} icon="light" label="Reset lights" />
                <Checkbox
                    wide={true}
                    label="Stick the lights to the camera"
                    value={false}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
                />
            </fieldset>
            <fieldset>
                <legend>Background</legend>
                <Button wide={true} icon="color" label="Set background color" />
                <Button
                    wide={true}
                    icon="image"
                    label="Use an environment image"
                />
            </fieldset>
        </div>
    )
}

function getClassNames(props: SceneMenuViewProps): string {
    const classNames = ["custom", "app-SceneMenuView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
