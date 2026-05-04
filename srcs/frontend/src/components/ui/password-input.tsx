"use client"

import type { ButtonProps, GroupProps, InputProps } from "@chakra-ui/react"
import { IconButton, Input, InputGroup, mergeRefs, useControllableState } from "@chakra-ui/react"
import * as React from "react"
import { LuEye, LuEyeOff } from "react-icons/lu"

export interface PasswordInputProps extends InputProps {
  rootProps?: GroupProps
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const { rootProps, defaultVisible, visible: visibleProp, onVisibleChange, ...rest } = props
    const [visible, setVisible] = useControllableState({ value: visibleProp, defaultValue: defaultVisible ?? false, onChange: onVisibleChange })
    const inputRef = React.useRef<HTMLInputElement>(null)
    return (
      <InputGroup endElement={
        <VisibilityTrigger disabled={rest.disabled} onPointerDown={(e) => { if (rest.disabled || e.button !== 0) return; e.preventDefault(); setVisible(!visible) }}>
          {visible ? <LuEyeOff /> : <LuEye />}
        </VisibilityTrigger>
      } {...rootProps}>
        <Input {...rest} ref={mergeRefs(ref, inputRef)} type={visible ? "text" : "password"} />
      </InputGroup>
    )
  }
)

const VisibilityTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(function VisibilityTrigger(props, ref) {
  return <IconButton tabIndex={-1} ref={ref} me="-2" aspectRatio="square" size="sm" variant="ghost" height="calc(100% - {spacing.2})" aria-label="Toggle password visibility" {...props} />
})
