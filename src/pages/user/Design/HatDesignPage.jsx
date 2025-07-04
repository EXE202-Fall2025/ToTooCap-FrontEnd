import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Input } from "@mui/material";
import {
  Undo,
  Redo,
  Image,
  TextFields,
  Save,
  ColorLens,
} from "@mui/icons-material";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

export default function HatDesignPage() {
  const { editor, onReady } = useFabricJSEditor();
  const fileInputRef = useRef(null);
  const [boundaryRef, setBoundaryRef] = useState(null);

  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 500;

  const addText = () => {
    editor?.addText("Nhập chữ");
  };

  const addImage = () => {
    const imgUrl = "https://cdn-icons-png.flaticon.com/512/25/25231.png";
    const canvas = editor.canvas;
    const boundary = boundaryRef;

    if (!boundary) {
      alert("Không tìm thấy vùng thiết kế!");
      return;
    }

    window.fabric.Image.fromURL(imgUrl, (img) => {
      const maxW = boundary.width * boundary.scaleX;
      const maxH = boundary.height * boundary.scaleY;
      const scale = Math.min(maxW / img.width, maxH / img.height);

      img.set({
        left: boundary.left + (maxW - img.width * scale) / 2,
        top: boundary.top + (maxH - img.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const canvas = editor.canvas;
    const boundary = boundaryRef;
    if (!boundary) return;

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (f) {
      window.fabric.Image.fromURL(f.target.result, (img) => {
        const maxW = boundary.width * boundary.scaleX;
        const maxH = boundary.height * boundary.scaleY;
        const scale = Math.min(maxW / img.width, maxH / img.height);

        img.set({
          left: boundary.left + (maxW - img.width * scale) / 2,
          top: boundary.top + (maxH - img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUndo = () => {
    alert("Undo chưa được triển khai");
  };

  const handleRedo = () => {
    alert("Redo chưa được triển khai");
  };

  const handleSave = () => {
    const dataURL = editor.canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.download = "hat-design.png";
    link.href = dataURL;
    link.click();
  };

  const handleColorChange = (e) => {
    const canvas = editor.canvas;
    const newColor = e.target.value;
    const boundary = boundaryRef;
    if (boundary) {
      boundary.set({ fill: newColor });
      canvas.renderAll();
    }
  };

  const addHatBackground = () => {
    const canvas = editor.canvas;

    window.fabric.Image.fromURL(
      "https://gecko.vn/media/assets/product-design/thumb/non.png",
      (hatImg) => {
        const scale = Math.min(
          CANVAS_WIDTH / hatImg.width,
          CANVAS_HEIGHT / hatImg.height
        );

        hatImg.set({
          scaleX: scale,
          scaleY: scale,
          left: (CANVAS_WIDTH - hatImg.width * scale) / 2,
          top: (CANVAS_HEIGHT - hatImg.height * scale) / 2,
          selectable: false,
          evented: false,
        });

        canvas.add(hatImg);
        canvas.sendToBack(hatImg);
      }
    );

    const boundary = new window.fabric.Rect({
      left: 150,
      top: 100,
      width: 200,
      height: 120,
      fill: "#fefefe",
      stroke: "#aaa",
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });
    canvas.add(boundary);
    setBoundaryRef(boundary);
  };

  useEffect(() => {
    if (editor?.canvas) {
      const canvas = editor.canvas;
      canvas.setWidth(CANVAS_WIDTH);
      canvas.setHeight(CANVAS_HEIGHT);
      canvas.setBackgroundColor("#fdfdf8", canvas.renderAll.bind(canvas));

      // Gắn sự kiện kéo thả ảnh
      const domCanvas = document.querySelector(".sample-canvas canvas");
      domCanvas.addEventListener("dragover", (e) => e.preventDefault());
      domCanvas.addEventListener("drop", handleFileDrop);

      addHatBackground();
    }
  }, [editor]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Toolbar bên trái */}
      <Box
        sx={{
          width: 60,
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          gap: 2,
        }}
      >
        <Tooltip title="Thêm chữ">
          <IconButton onClick={addText}>
            <TextFields />
          </IconButton>
        </Tooltip>

        <Tooltip title="Thêm hình ảnh">
          <IconButton onClick={addImage}>
            <Image />
          </IconButton>
        </Tooltip>

        <Tooltip title="Đổi màu vùng thiết kế">
          <label>
            <input
              type="color"
              onChange={handleColorChange}
              style={{ width: 0, height: 0, opacity: 0 }}
            />
            <IconButton component="span">
              <ColorLens />
            </IconButton>
          </label>
        </Tooltip>

        <Tooltip title="Undo">
          <IconButton onClick={handleUndo}>
            <Undo />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo">
          <IconButton onClick={handleRedo}>
            <Redo />
          </IconButton>
        </Tooltip>

        <Tooltip title="Lưu thiết kế">
          <IconButton onClick={handleSave}>
            <Save />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Canvas ở giữa */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9f9f4",
        }}
      >
        <FabricJSCanvas
          className="sample-canvas"
          onReady={onReady}
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        />
      </Box>
    </Box>
  );
}
