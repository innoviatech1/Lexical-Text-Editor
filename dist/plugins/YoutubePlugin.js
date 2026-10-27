"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Youtube } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createYoutubeNode } from "../nodes/YoutubeNode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
export default function YoutubePlugin() {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setURL] = useState("");
    const [editor] = useLexicalComposerContext();
    const onEmbed = () => {
        if (!url)
            return;
        const match = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);
        const id = match && match?.[2]?.length === 11 ? match?.[2] : null;
        if (!id)
            return;
        editor.update(() => {
            const node = $createYoutubeNode({ id });
            $insertNodes([node]);
        });
        setURL("");
        setIsOpen(false);
    };
    return (_jsx("div", { children: _jsxs(Dialog, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { size: "icon", variant: "ghost", className: "rounded-md text-gray-700 hover:bg-gray-200", children: _jsx(Youtube, { className: "h-4 w-4 text-red-600" }) }) }), _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "!text-xl", children: "Embed YouTube Video" }) }), _jsx("div", { className: "py-2", children: _jsx(Input, { value: url, onChange: (e) => setURL(e.target.value), placeholder: "Add YouTube URL" }) }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: onEmbed, disabled: !url, className: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50", children: "Embed" }) })] })] }) }));
}
