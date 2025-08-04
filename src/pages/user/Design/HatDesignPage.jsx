import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Button, Typography } from "@mui/material";
import {
  Undo,
  Redo,
  TextFields,
  Save,
  ColorLens,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import anhnon from "../../../assets/image_non.png";
import { useNavigate } from "react-router-dom";

export default function HatDesignPage() {
  const navigate = useNavigate();
  // Hook để quản lý fabric.js editor và canvas
  const { editor, onReady } = useFabricJSEditor();

  // === REFS ===
  const fileInputRef = useRef(null);
  const [boundaryRef, setBoundaryRef] = useState(null);

  // === STATE QUẢN LÝ VIEWS ===
  const [view, setView] = useState("front");
  const [designs, setDesigns] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  // === STATE QUẢN LÝ UNDO/REDO ===
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const isRestoringRef = useRef(false);

  // === STATE QUẢN LÝ ZOOM ===
  const [zoomLevel, setZoomLevel] = useState(1);

  // === STATE QUẢN LÝ CANVAS SIZE ===
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth - 80, // Trừ sidebar width
    height: window.innerHeight - 80, // Trừ header height
  });

  // === CONSTANTS ===
  const SIDEBAR_WIDTH = 80;
  const HEADER_HEIGHT = 80;

  // === DATA ===
  const hatImages = {
    front: anhnon, // Ảnh local
    back: anhnon, // Tạm thời dùng cùng ảnh để test
    left: anhnon,
    right: anhnon,
  };

  // === HELPER FUNCTION: CLEANUP BOUNDARY - CẢI TIẾN ===
  const cleanupBoundary = (canvas) => {
    // Tìm và xóa TẤT CẢ boundary objects
    const objects = canvas.getObjects();
    const boundariesToRemove = objects.filter(
      (obj) =>
        obj.type === "rect" &&
        obj.strokeDashArray &&
        obj.strokeDashArray.length > 0 &&
        !obj.selectable
    );

    boundariesToRemove.forEach((boundary) => {
      canvas.remove(boundary);
    });

    setBoundaryRef(null);
  };

  // === HELPER FUNCTION: CREATE BOUNDARY ===
  const createBoundary = (canvas, hatImg) => {
    const boundaryWidth = hatImg.width * hatImg.scaleX * 0.252;
    const boundaryHeight = hatImg.height * hatImg.scaleY * 0.17;
    const boundaryLeft =
      hatImg.left + (hatImg.width * hatImg.scaleX - boundaryWidth) / 1.665;
    const boundaryTop = hatImg.top + hatImg.height * hatImg.scaleY * 0.355;

    const boundary = new window.fabric.Rect({
      left: boundaryLeft,
      top: boundaryTop,
      width: boundaryWidth,
      height: boundaryHeight,
      fill: "rgba(255, 107, 107, 0.15)",
      stroke: "rgba(255, 107, 107, 0.8)",
      strokeWidth: 1,
      strokeDashArray: [8, 5],
      selectable: false,
      evented: false,
      // Thêm custom property để dễ nhận diện
      isBoundary: true,
    });

    canvas.add(boundary);
    setBoundaryRef(boundary);
    return boundary;
  };

  // === HELPER FUNCTION: SAVE DESIGN WITHOUT BOUNDARY ===
  const saveDesignWithoutBoundary = (canvas) => {
    // Tạm thời ẩn boundary trước khi save
    const tempBoundary = boundaryRef;
    if (tempBoundary) {
      canvas.remove(tempBoundary);
    }

    // Lấy design data
    const designData = canvas.toJSON(["selectable", "evented"]);

    // Thêm lại boundary nếu có
    if (tempBoundary && view === "front") {
      canvas.add(tempBoundary);
      canvas.bringToFront(tempBoundary);
    }

    return designData;
  };

  // === RESIZE HANDLER ===
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth - SIDEBAR_WIDTH;
      const newHeight = window.innerHeight - HEADER_HEIGHT;

      setCanvasSize({
        width: newWidth,
        height: newHeight,
      });

      // Resize canvas nếu đã khởi tạo
      if (editor?.canvas) {
        editor.canvas.setWidth(newWidth);
        editor.canvas.setHeight(newHeight);
        editor.canvas.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);

    // Set initial size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [editor]);

  // === FUNCTIONS: THÊM ELEMENTS ===
  const addText = () => {
    if (!editor?.canvas) return;

    // Nếu ở view front và có boundary, đặt text trong boundary
    let textLeft, textTop;
    if (view === "front" && boundaryRef) {
      textLeft = boundaryRef.left + boundaryRef.width / 2;
      textTop = boundaryRef.top + boundaryRef.height / 2;
    } else {
      textLeft = canvasSize.width / 2;
      textTop = canvasSize.height / 2;
    }

    const text = new window.fabric.Text("Sample Text", {
      left: textLeft,
      top: textTop,
      originX: "center",
      originY: "center",
      fontSize: 20,
      fill: "#000000",
      fontFamily: "Arial",
    });

    // Nếu ở view front, giới hạn text trong boundary
    if (view === "front" && boundaryRef) {
      const enforceTextBoundary = () => {
        const boundLeft = boundaryRef.left;
        const boundTop = boundaryRef.top;
        const boundRight = boundaryRef.left + boundaryRef.width;
        const boundBottom = boundaryRef.top + boundaryRef.height;

        const textWidth = text.getScaledWidth();
        const textHeight = text.getScaledHeight();

        // Tính toán vị trí giới hạn
        const minLeft = boundLeft + textWidth / 2;
        const maxLeft = boundRight - textWidth / 2;
        const minTop = boundTop + textHeight / 2;
        const maxTop = boundBottom - textHeight / 2;

        // Áp dụng giới hạn
        text.left = Math.max(minLeft, Math.min(maxLeft, text.left));
        text.top = Math.max(minTop, Math.min(maxTop, text.top));

        // Cập nhật vị trí
        text.setCoords();
        editor.canvas.renderAll();
      };

      text.on("moving", enforceTextBoundary);
      text.on("scaling", enforceTextBoundary);
      text.on("modified", enforceTextBoundary);
    }

    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);

    // Đảm bảo text nằm trên mũ
    editor.canvas.bringToFront(text);
    if (boundaryRef) {
      editor.canvas.bringToFront(boundaryRef);
    }

    editor.canvas.renderAll();
  };

  // === ZOOM FUNCTIONS ===
  const handleZoomIn = () => {
    if (!editor?.canvas) return;
    const newZoom = Math.min(zoomLevel * 1.2, 3); // Giới hạn zoom max 3x
    setZoomLevel(newZoom);
    editor.canvas.setZoom(newZoom);
    editor.canvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!editor?.canvas) return;
    const newZoom = Math.max(zoomLevel / 1.2, 0.5); // Giới hạn zoom min 0.5x
    setZoomLevel(newZoom);
    editor.canvas.setZoom(newZoom);
    editor.canvas.renderAll();
  };

  const handleResetZoom = () => {
    if (!editor?.canvas) return;
    setZoomLevel(1);
    editor.canvas.setZoom(1);
    editor.canvas.renderAll();
  };

  const handleFileInputChange = (e) => {
    // CHỈ CHO PHÉP UPLOAD ẢNH KHI Ở VIEW "FRONT"
    if (view !== "front") {
      alert("Bạn chỉ có thể thêm ảnh ở mặt trước của mũ!");
      return;
    }

    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addImageToCanvas(event.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Reset file input để có thể chọn lại cùng file
    e.target.value = "";
  };

  const handleFileDrop = (e) => {
    e.preventDefault();

    // CHỈ CHO PHÉP DROP ẢNH KHI Ở VIEW "FRONT"
    if (view !== "front") {
      alert("Bạn chỉ có thể thêm ảnh ở mặt trước của mũ!");
      return;
    }

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addImageToCanvas(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageToCanvas = (imageSrc) => {
    if (!editor?.canvas || !boundaryRef) return;

    window.fabric.Image.fromURL(imageSrc, (img) => {
      // Scale ảnh để vừa với boundary
      const maxWidth = boundaryRef.width * 0.9;
      const maxHeight = boundaryRef.height * 0.9;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: boundaryRef.left + boundaryRef.width / 2,
        top: boundaryRef.top + boundaryRef.height / 2,
        originX: "center",
        originY: "center",
        lockUniScaling: false,
      });

      // SỬA LỖI: Cải tiến logic giới hạn di chuyển ảnh trong boundary
      const enforceImageBoundary = () => {
        const boundLeft = boundaryRef.left;
        const boundTop = boundaryRef.top;
        const boundRight = boundaryRef.left + boundaryRef.width;
        const boundBottom = boundaryRef.top + boundaryRef.height;

        const imgWidth = img.getScaledWidth();
        const imgHeight = img.getScaledHeight();

        // Tính toán vị trí giới hạn
        const minLeft = boundLeft + imgWidth / 2;
        const maxLeft = boundRight - imgWidth / 2;
        const minTop = boundTop + imgHeight / 2;
        const maxTop = boundBottom - imgHeight / 2;

        // Áp dụng giới hạn
        img.left = Math.max(minLeft, Math.min(maxLeft, img.left));
        img.top = Math.max(minTop, Math.min(maxTop, img.top));

        // Cập nhật vị trí
        img.setCoords();
        editor.canvas.renderAll();
      };

      // Event listener cho việc di chuyển
      img.on("moving", enforceImageBoundary);

      // Event listener cho việc scaling
      img.on("scaling", function () {
        // Giới hạn kích thước không vượt quá boundary
        const maxScaleX = boundaryRef.width / img.width;
        const maxScaleY = boundaryRef.height / img.height;
        const maxScale = Math.min(maxScaleX, maxScaleY);

        if (img.scaleX > maxScale) {
          img.set("scaleX", maxScale);
        }
        if (img.scaleY > maxScale) {
          img.set("scaleY", maxScale);
        }

        // Sau khi scale, cũng cần kiểm tra vị trí
        enforceImageBoundary();
      });

      // SỬA LỖI: Thêm event listener cho việc kết thúc di chuyển/scaling
      img.on("modified", enforceImageBoundary);

      editor.canvas.add(img);
      editor.canvas.setActiveObject(img);

      // Đảm bảo ảnh được thêm nằm trên mũ nhưng dưới boundary
      editor.canvas.bringToFront(img);
      if (boundaryRef) {
        editor.canvas.bringToFront(boundaryRef);
      }

      // Gọi hàm giới hạn ngay sau khi thêm để đảm bảo vị trí đúng
      enforceImageBoundary();
    });
  };

  // === UNDO/REDO FUNCTIONS ===
  const handleUndo = () => {
    if (undoStack.length < 2 || !editor?.canvas) return;

    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

    setRedoStack((prev) => [...prev, currentState]);
    setUndoStack((prev) => prev.slice(0, -1));

    isRestoringRef.current = true;
    editor.canvas.loadFromJSON(previousState, () => {
      editor.canvas.renderAll();
      isRestoringRef.current = false;
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0 || !editor?.canvas) return;

    const stateToRestore = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, stateToRestore]);

    isRestoringRef.current = true;
    editor.canvas.loadFromJSON(stateToRestore, () => {
      editor.canvas.renderAll();
      isRestoringRef.current = false;
    });
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    if (boundaryRef) {
      boundaryRef.set("fill", color + "80");
      editor.canvas.renderAll();
    }
  };

  const handleSave = () => {
    // Kiểm tra đăng nhập (ví dụ: kiểm tra token trong localStorage)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để lưu thiết kế!");
      navigate("/"); // hoặc navigate("/login") nếu bạn có route login riêng
      return;
    }
    if (!editor?.canvas) return;

    const dataURL = editor.canvas.toDataURL({
      format: "png",
      quality: 0.8,
    });

    const link = document.createElement("a");
    link.download = `hat-design-${view}.png`;
    link.href = dataURL;
    link.click();

    console.log("Design saved!");
  };

  const handleChangeView = (newView) => {
    if (newView === view) return;

    if (editor?.canvas) {
      // SỬA: Lưu design mà không có boundary
      const currentDesign = saveDesignWithoutBoundary(editor.canvas);
      setDesigns((prev) => ({
        ...prev,
        [view]: currentDesign,
      }));
    }

    setView(newView);
  };

  // === EFFECTS ===
  useEffect(() => {
    if (editor?.canvas) {
      const initialState = saveDesignWithoutBoundary(editor.canvas);
      setUndoStack([initialState]);
      setRedoStack([]);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    const handleChange = () => {
      if (isRestoringRef.current) return;

      const currentState = saveDesignWithoutBoundary(canvas);
      setUndoStack((prev) => [...prev, currentState]);
      setRedoStack([]);
    };

    // SỬA LỖI: Wheel zoom function
    const handleWheel = (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;

      // Giới hạn zoom
      if (zoom > 3) zoom = 3;
      if (zoom < 0.5) zoom = 0.5;

      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      setZoomLevel(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    canvas.on("object:added", handleChange);
    canvas.on("object:modified", handleChange);
    canvas.on("object:removed", handleChange);
    canvas.on("mouse:wheel", handleWheel);

    return () => {
      canvas.off("object:added", handleChange);
      canvas.off("object:modified", handleChange);
      canvas.off("object:removed", handleChange);
      canvas.off("mouse:wheel", handleWheel);
    };
  }, [editor]);

  // === HELPER FUNCTION: REAPPLY BOUNDARY CONSTRAINTS ===
  const reapplyBoundaryConstraints = (canvas, boundaryRef) => {
    if (view !== "front" || !boundaryRef) return;

    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      // Chỉ áp dụng cho text và image (không phải hat image và boundary)
      if ((obj.type === "text" || obj.type === "image") && obj.selectable) {
        // Remove existing event listeners để tránh duplicate
        obj.off("moving");
        obj.off("scaling");
        obj.off("modified");

        // Tạo constraint function cho object này
        const enforceObjectBoundary = () => {
          const boundLeft = boundaryRef.left;
          const boundTop = boundaryRef.top;
          const boundRight = boundaryRef.left + boundaryRef.width;
          const boundBottom = boundaryRef.top + boundaryRef.height;

          const objWidth = obj.getScaledWidth();
          const objHeight = obj.getScaledHeight();

          // Tính toán vị trí giới hạn
          const minLeft = boundLeft + objWidth / 2;
          const maxLeft = boundRight - objWidth / 2;
          const minTop = boundTop + objHeight / 2;
          const maxTop = boundBottom - objHeight / 2;

          // Áp dụng giới hạn
          obj.left = Math.max(minLeft, Math.min(maxLeft, obj.left));
          obj.top = Math.max(minTop, Math.min(maxTop, obj.top));

          // Cập nhật vị trí
          obj.setCoords();
          canvas.renderAll();
        };

        // Apply constraints cho scaling (chỉ với image)
        if (obj.type === "image") {
          const enforceScalingBoundary = () => {
            const maxScaleX = boundaryRef.width / obj.width;
            const maxScaleY = boundaryRef.height / obj.height;
            const maxScale = Math.min(maxScaleX, maxScaleY);

            if (obj.scaleX > maxScale) {
              obj.set("scaleX", maxScale);
            }
            if (obj.scaleY > maxScale) {
              obj.set("scaleY", maxScale);
            }

            enforceObjectBoundary();
          };

          obj.on("scaling", enforceScalingBoundary);
        }

        // Apply event listeners
        obj.on("moving", enforceObjectBoundary);
        obj.on("modified", enforceObjectBoundary);

        // Apply constraint ngay lập tức
        enforceObjectBoundary();
      }
    });
  };

  // === LOAD VIEW EFFECT ===
  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    console.log("Loading image for view:", view);
    console.log("Canvas size:", canvasSize.width, "x", canvasSize.height);

    // QUAN TRỌNG: Clear canvas và cleanup boundary trước
    canvas.clear();
    cleanupBoundary(canvas);

    // Reset zoom khi chuyển view
    setZoomLevel(1);
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // Đảm bảo canvas có kích thước theo màn hình
    canvas.setWidth(canvasSize.width);
    canvas.setHeight(canvasSize.height);

    // Load ảnh mũ
    window.fabric.Image.fromURL(
      hatImages[view],
      (hatImg) => {
        console.log("Image loaded successfully:", hatImg);
        console.log("Original image size:", hatImg.width, "x", hatImg.height);

        // Tính scale để ảnh chiếm 40% canvas
        const targetWidth = canvasSize.width * 0.4;
        const targetHeight = canvasSize.height * 0.4;

        const scaleX = targetWidth / hatImg.width;
        const scaleY = targetHeight / hatImg.height;
        const scale = Math.min(scaleX, scaleY);

        console.log("Scale applied:", scale);

        // Tính toán vị trí chính xác của ảnh mũ
        const hatWidth = hatImg.width * scale;
        const hatHeight = hatImg.height * scale;
        const hatLeft = canvasSize.width / 2 - hatWidth / 2;
        const hatTop = canvasSize.height / 2 - hatHeight / 2;

        hatImg.set({
          scaleX: scale,
          scaleY: scale,
          left: hatLeft,
          top: hatTop,
          selectable: false,
          evented: false,
        });

        canvas.add(hatImg);
        canvas.sendToBack(hatImg);

        // CHỈ TẠO BOUNDARY KHI Ở VIEW "FRONT"
        let currentBoundary = null;
        if (view === "front") {
          currentBoundary = createBoundary(canvas, hatImg);
        }

        // Load thiết kế cũ nếu có
        if (designs[view]) {
          canvas.loadFromJSON(designs[view], () => {
            // QUAN TRỌNG: Cleanup boundary sau khi load
            cleanupBoundary(canvas);

            // Recreate boundary cho front view
            if (view === "front") {
              const hatImgAfterLoad = canvas
                .getObjects()
                .find((obj) => obj.type === "image" && !obj.selectable);
              if (hatImgAfterLoad) {
                currentBoundary = createBoundary(canvas, hatImgAfterLoad);

                // SỬA LỖI: Truyền boundary trực tiếp vào hàm
                setTimeout(() => {
                  reapplyBoundaryConstraints(canvas, currentBoundary);
                }, 150); // Tăng timeout để đảm bảo boundary đã được tạo
              }
            }

            canvas.renderAll();
          });
        } else {
          // Nếu không có design cũ và đang ở front view, vẫn cần apply constraints
          if (view === "front" && currentBoundary) {
            setTimeout(() => {
              reapplyBoundaryConstraints(canvas, currentBoundary);
            }, 150);
          }
          canvas.renderAll();
        }
      },
      { crossOrigin: "anonymous" }
    );
  }, [view, editor, canvasSize, designs]);

  // === RENDER ===
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        gap={1}
        justifyContent="center"
        p={2}
        sx={{
          height: HEADER_HEIGHT,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <Button
          size="medium"
          variant={view === "front" ? "contained" : "outlined"}
          onClick={() => handleChangeView("front")}
        >
          Trước
        </Button>
        <Button
          size="medium"
          variant={view === "back" ? "contained" : "outlined"}
          onClick={() => handleChangeView("back")}
        >
          Sau
        </Button>
        <Button
          size="medium"
          variant={view === "left" ? "contained" : "outlined"}
          onClick={() => handleChangeView("left")}
        >
          Trái
        </Button>
        <Button
          size="medium"
          variant={view === "right" ? "contained" : "outlined"}
          onClick={() => handleChangeView("right")}
        >
          Phải
        </Button>
      </Box>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            background: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            gap: 2,
            borderRight: "1px solid #e0e0e0",
            flexShrink: 0,
          }}
        >
          <Tooltip title="Thêm chữ" placement="right">
            <IconButton onClick={addText} size="large">
              <TextFields />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              view === "front"
                ? "Upload ảnh lên mũ"
                : "Chỉ có thể thêm ảnh ở mặt trước"
            }
            placement="right"
          >
            <span>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                  disabled={view !== "front"}
                />
                <IconButton
                  component="span"
                  size="large"
                  disabled={view !== "front"}
                  sx={{
                    opacity: view === "front" ? 1 : 0.5,
                    cursor: view === "front" ? "pointer" : "not-allowed",
                  }}
                >
                  <UploadFileIcon />
                </IconButton>
              </label>
            </span>
          </Tooltip>

          <Tooltip title="Đổi màu vùng thiết kế" placement="right">
            <label>
              <input
                type="color"
                onChange={handleColorChange}
                style={{ width: 0, height: 0, opacity: 0 }}
              />
              <IconButton component="span" size="large">
                <ColorLens />
              </IconButton>
            </label>
          </Tooltip>

          {/* THÊM CÁC NÚT ZOOM */}
          <Tooltip title="Phóng to" placement="right">
            <IconButton onClick={handleZoomIn} size="large">
              <ZoomIn />
            </IconButton>
          </Tooltip>

          <Tooltip title="Thu nhỏ" placement="right">
            <IconButton onClick={handleZoomOut} size="large">
              <ZoomOut />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={`Zoom: ${Math.round(zoomLevel * 100)}% - Click để reset`}
            placement="right"
          >
            <IconButton onClick={handleResetZoom} size="large">
              <Typography
                variant="caption"
                sx={{ fontSize: "10px", fontWeight: "bold" }}
              >
                {Math.round(zoomLevel * 100)}%
              </Typography>
            </IconButton>
          </Tooltip>

          <Tooltip title="Undo" placement="right">
            <span>
              <IconButton
                onClick={handleUndo}
                disabled={undoStack.length < 2}
                size="large"
              >
                <Undo />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Redo" placement="right">
            <span>
              <IconButton
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                size="large"
              >
                <Redo />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Lưu thiết kế" placement="right">
            <IconButton onClick={handleSave} size="large">
              <Save />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Canvas */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            backgroundColor: "#f9f9f4",
            overflow: "hidden",
            position: "relative",
          }}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <FabricJSCanvas
            className="sample-canvas"
            onReady={onReady}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
