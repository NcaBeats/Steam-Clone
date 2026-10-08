import { EyeOff } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type InputGroupDemoProps = React.ComponentProps<typeof InputGroupInput>;

export function InputGroupDemo({ ..._props }: InputGroupDemoProps) {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="password" />
      <InputGroupAddon align="inline-end">
        <EyeOff />
      </InputGroupAddon>
    </InputGroup>
  );
}
