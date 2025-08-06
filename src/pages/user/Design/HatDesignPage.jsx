import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ProductService from "../../../services/productService";
import CloudinaryService from "../../../services/cloudinary.service";

export default function HatDesignPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const { editor, onReady } = useFabricJSEditor();

  const fileInputRef = useRef(null);
  const [boundaryRef, setBoundaryRef] = useState(null);
  const isRestoringRef = useRef(false);

  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("front");
  const [designs, setDesigns] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  // Thêm state cho ảnh từng mặt từ API
  const [hatImages, setHatImages] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth - 80,
    height: window.innerHeight - 80,
  });

  const [selectedObject, setSelectedObject] = useState(null);

  const SIDEBAR_WIDTH = 80;
  const HEADER_HEIGHT = 80;

  // === HELPER FUNCTIONS FROM OLD CODE ===
  const cleanupBoundary = (canvas) => {
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
      fill: "transparent",
      stroke: "rgba(145, 133, 133, 0.8)",
      strokeWidth: 1,
      strokeDashArray: [8, 5],
      selectable: false,
      evented: false,
      isBoundary: true,
    });

    canvas.add(boundary);
    setBoundaryRef(boundary);
    return boundary;
  };

  const saveDesignWithoutBoundary = (canvas) => {
    const tempBoundary = boundaryRef;
    if (tempBoundary) {
      canvas.remove(tempBoundary);
    }

    const designData = canvas.toJSON(["selectable", "evented"]);

    if (tempBoundary && view === "front") {
      canvas.add(tempBoundary);
      canvas.bringToFront(tempBoundary);
    }

    return designData;
  };

  // === FETCH PRODUCT INFO ===
  useEffect(() => {
    if (!productId) {
      alert("Không có thông tin sản phẩm!");
      navigate("/choose-product");
      return;
    }

    if (location.state?.product) {
      setProductInfo(location.state.product);
      setLoading(false);
    } else {
      fetchProductInfo(productId);
    }
  }, [productId, location.state, navigate]);

  const fetchProductInfo = async (id) => {
    try {
      const response = await ProductService.getProductById(id);
      if (response.success) {
        setProductInfo(response.data);
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Không tìm thấy sản phẩm!");
      navigate("/choose-product");
    } finally {
      setLoading(false);
    }
  };

  // === FETCH HAT IMAGES ===
  useEffect(() => {
    if (!productId) return;
    const fetchImages = async () => {
      try {
        // Thử endpoint khác hoặc thêm filter phía client
        const res = await fetch(
          `http://54.169.159.141:3000/image/get?currentPage=1&limit=100&sortBy=createdAt&sortOrder=desc`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Filter phía client theo product_id
          const productImages = data.data.filter(
            (img) => img.product_id === productId
          );

          const images = {
            front: null,
            back: null,
            left: null,
            right: null,
          };

          productImages.forEach((img) => {
            if (["front", "back", "left", "right"].includes(img.name)) {
              images[img.name] = img.image_url;
            }
          });

          setHatImages(images);
          console.log("Loaded images for product:", productId, images);
        }
      } catch (err) {
        console.error("Không thể lấy ảnh các mặt sản phẩm:", err);
      }
    };
    fetchImages();
  }, [productId]);

  // === CANVAS SETUP (UPDATED WITH OLD LOGIC) ===
  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    // Clear canvas và cleanup boundary trước
    canvas.clear();
    cleanupBoundary(canvas);

    // Reset zoom khi chuyển view
    setZoomLevel(1);
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    // Đảm bảo canvas có kích thước theo màn hình
    canvas.setWidth(canvasSize.width);
    canvas.setHeight(canvasSize.height);
    if (!hatImages[view]) {
      // Save initial state ngay cả khi không có ảnh
      const initialState = canvas.toJSON();
      setUndoStack([initialState]);
      setRedoStack([]);
      canvas.renderAll();
      return; // Dừng lại, không load fabric.Image
    }

    // Load ảnh mũ vào canvas (không phải background)
    window.fabric.Image.fromURL(
      hatImages[view],
      (hatImg) => {
        // Tính scale để ảnh chiếm 40% canvas
        const targetWidth = canvasSize.width * 0.4;
        const targetHeight = canvasSize.height * 0.4;

        const scaleX = targetWidth / hatImg.width;
        const scaleY = targetHeight / hatImg.height;
        const scale = Math.min(scaleX, scaleY);

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
            cleanupBoundary(canvas);

            if (view === "front") {
              const hatImgAfterLoad = canvas
                .getObjects()
                .find((obj) => obj.type === "image" && !obj.selectable);
              if (hatImgAfterLoad) {
                currentBoundary = createBoundary(canvas, hatImgAfterLoad);
              }
            }
            canvas.renderAll();
          });
        } else {
          canvas.renderAll();
        }
      },
      { crossOrigin: "anonymous" }
    );

    // // Save initial state for undo/redo
    // const initialState = canvas.toJSON();
    // setUndoStack([initialState]);
    // setRedoStack([]);
  }, [view, editor, canvasSize, designs, hatImages]);

  // === CANVAS EVENT HANDLERS ===
  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    const handleChange = () => {
      if (isRestoringRef.current) return;
      const currentState = saveDesignWithoutBoundary(canvas);
      setUndoStack((prev) => [...prev, currentState]);
      setRedoStack([]);
    };

    const handleWheel = (opt) => {
      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;

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

  // === TEXT HANDLER ===
  const addText = () => {
    if (!editor?.canvas) return;

    let textLeft, textTop;
    if (view === "front" && boundaryRef) {
      textLeft = boundaryRef.left + boundaryRef.width / 2;
      textTop = boundaryRef.top + boundaryRef.height / 2;
    } else {
      textLeft = canvasSize.width / 2;
      textTop = canvasSize.height / 2;
    }

    const text = new window.fabric.Text("Nhập text", {
      left: textLeft,
      top: textTop,
      originX: "center",
      originY: "center",
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#000000",
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

        const minLeft = boundLeft + textWidth / 2;
        const maxLeft = boundRight - textWidth / 2;
        const minTop = boundTop + textHeight / 2;
        const maxTop = boundBottom - textHeight / 2;

        text.left = Math.max(minLeft, Math.min(maxLeft, text.left));
        text.top = Math.max(minTop, Math.min(maxTop, text.top));

        text.setCoords();
        editor.canvas.renderAll();
      };

      text.on("moving", enforceTextBoundary);
      text.on("scaling", enforceTextBoundary);
      text.on("modified", enforceTextBoundary);
    }

    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.bringToFront(text);
    if (boundaryRef) {
      editor.canvas.bringToFront(boundaryRef);
    }
    editor.canvas.renderAll();
  };

  // === FILE HANDLERS (FROM OLD CODE) ===
  const handleFileInputChange = (e) => {
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

    e.target.value = "";
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
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

      // Logic giới hạn di chuyển ảnh trong boundary
      const enforceImageBoundary = () => {
        const boundLeft = boundaryRef.left;
        const boundTop = boundaryRef.top;
        const boundRight = boundaryRef.left + boundaryRef.width;
        const boundBottom = boundaryRef.top + boundaryRef.height;

        const imgWidth = img.getScaledWidth();
        const imgHeight = img.getScaledHeight();

        const minLeft = boundLeft + imgWidth / 2;
        const maxLeft = boundRight - imgWidth / 2;
        const minTop = boundTop + imgHeight / 2;
        const maxTop = boundBottom - imgHeight / 2;

        img.left = Math.max(minLeft, Math.min(maxLeft, img.left));
        img.top = Math.max(minTop, Math.min(maxTop, img.top));

        img.setCoords();
        editor.canvas.renderAll();
      };

      img.on("moving", enforceImageBoundary);
      img.on("scaling", function () {
        const maxScaleX = boundaryRef.width / img.width;
        const maxScaleY = boundaryRef.height / img.height;

        if (img.scaleX >= maxScaleX) {
          img.set("scaleX", maxScaleX);
        }
        if (img.scaleY >= maxScaleY) {
          img.set("scaleY", maxScaleY);
        }

        enforceImageBoundary();
      });
      img.on("modified", enforceImageBoundary);

      editor.canvas.add(img);
      editor.canvas.setActiveObject(img);
      editor.canvas.bringToFront(img);
      if (boundaryRef) {
        editor.canvas.bringToFront(boundaryRef);
      }

      enforceImageBoundary();
    });
  };
  useEffect(() => {
    if (!editor?.canvas) return;

    const handleSelection = () => {
      const obj = editor.canvas.getActiveObject();
      setSelectedObject(obj || null);
    };

    editor.canvas.on("selection:created", handleSelection);
    editor.canvas.on("selection:updated", handleSelection);
    editor.canvas.on("selection:cleared", handleSelection);

    return () => {
      editor.canvas.off("selection:created", handleSelection);
      editor.canvas.off("selection:updated", handleSelection);
      editor.canvas.off("selection:cleared", handleSelection);
    };
  }, [editor]);
  // === COLOR HANDLER ===
  const handleColorChange = (e) => {
    const color = e.target.value;
    if (!editor?.canvas) return;

    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      if (activeObject.type === "text") {
        activeObject.set("fill", color);
      } else if (
        activeObject.type === "rect" ||
        activeObject.type === "circle"
      ) {
        activeObject.set("fill", color);
      }
      editor.canvas.renderAll();
    } else if (boundaryRef) {
      // Nếu không có object được chọn, đổi màu boundary
      boundaryRef.set("fill", color + "80");
      editor.canvas.renderAll();
    }
  };

  // === ZOOM HANDLERS ===
  const handleZoomIn = () => {
    if (!editor?.canvas) return;
    const newZoom = Math.min(zoomLevel * 1.2, 3);
    setZoomLevel(newZoom);
    editor.canvas.setZoom(newZoom);
    editor.canvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!editor?.canvas) return;
    const newZoom = Math.max(zoomLevel / 1.2, 0.5);
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

  // === UNDO/REDO HANDLERS ===
  const handleUndo = () => {
    if (!editor?.canvas || undoStack.length < 2) return;

    isRestoringRef.current = true;
    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

    setRedoStack((prev) => [...prev, currentState]);
    setUndoStack((prev) => prev.slice(0, -1));

    editor.canvas.loadFromJSON(previousState, () => {
      editor.canvas.renderAll();
      isRestoringRef.current = false;
    });
  };

  const handleRedo = () => {
    if (!editor?.canvas || redoStack.length === 0) return;

    isRestoringRef.current = true;
    const stateToRestore = redoStack[redoStack.length - 1];

    setUndoStack((prev) => [...prev, stateToRestore]);
    setRedoStack((prev) => prev.slice(0, -1));

    editor.canvas.loadFromJSON(stateToRestore, () => {
      editor.canvas.renderAll();
      isRestoringRef.current = false;
    });
  };

  // === VIEW CHANGE HANDLER ===
  const handleChangeView = (newView) => {
    if (editor?.canvas && view !== newView) {
      const currentDesign = saveDesignWithoutBoundary(editor.canvas);
      setDesigns((prev) => ({ ...prev, [view]: currentDesign }));
    }
    setView(newView);
  };

  // === SAVE HANDLER ===
  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để lưu thiết kế!");
      navigate("/login");
      return;
    }

    if (!editor?.canvas) {
      alert("Canvas chưa sẵn sàng!");
      return;
    }

    if (!productInfo) {
      alert("Không có thông tin sản phẩm!");
      return;
    }

    try {
      // Hiển thị loading
      console.log("Đang lưu thiết kế...");
      const prevZoom = editor.canvas.getZoom();
      const prevViewport = editor.canvas.viewportTransform.slice();

      // Reset zoom về 1 và viewport về mặc định
      editor.canvas.setZoom(1);
      editor.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      editor.canvas.renderAll();
      const dataURL = editor.canvas.toDataURL({
        format: "png",
        quality: 0.92,
        multiplier: 5, // Tăng độ phân giải ảnh
      });
      // Khôi phục lại zoom và viewport cho người dùng
      editor.canvas.setZoom(prevZoom);
      editor.canvas.setViewportTransform(prevViewport);
      editor.canvas.renderAll();

      // Upload ảnh lên Cloudinary
      console.log("Uploading to Cloudinary...");
      const cloudinaryResult = await CloudinaryService.uploadBase64Image(
        dataURL
      );

      if (!cloudinaryResult.success) {
        alert(`Lỗi upload ảnh: ${cloudinaryResult.error}`);
        return;
      }

      console.log("Cloudinary upload success:", cloudinaryResult.url);

      const userInfoRes = await fetch(
        "http://54.169.159.141:3000/auth/user/get/loginUser",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const userInfo = await userInfoRes.json();

      if (!userInfo.success) {
        alert("Không thể lấy thông tin người dùng!");
        return;
      }

      let mainText = "";
      const objects = editor.canvas.getObjects();
      const textObj = objects.find((obj) => obj.type === "text");
      if (textObj) {
        mainText = textObj.text;
      }

      const res = await fetch("http://54.169.159.141:3000/customDesign/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          design_name: `${
            productInfo.name
          } - ${new Date().toLocaleDateString()}`,
          color: "White",
          text: mainText || "Custom Design",
          image_url: cloudinaryResult.url, // Sử dụng URL từ Cloudinary
          cloudinary_public_id: cloudinaryResult.public_id, // Lưu public_id để có thể xóa sau này
          status: true,
          user_id: userInfo.data._id,
          base_product_id: productInfo._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Lưu thiết kế thành công!");
      } else {
        alert(data.message || "Lưu thiết kế thất bại!");
      }
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Có lỗi xảy ra khi lưu thiết kế!");
    }
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

      if (editor?.canvas) {
        editor.canvas.setWidth(newWidth);
        editor.canvas.setHeight(newHeight);
        editor.canvas.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [editor]);

  if (loading || !productInfo) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải thông tin sản phẩm...</Typography>
      </Box>
    );
  }
  const getViewLabel = (view) => {
    switch (view) {
      case "front":
        return "Mặt trước";
      case "back":
        return "Mặt sau";
      case "left":
        return "Mặt trái";
      case "right":
        return "Mặt phải";
      default:
        return "";
    }
  };

  // Kiểm tra nếu không có ảnh cho mặt hiện tại
  const noImageForCurrentView = !hatImages[view];
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
        justifyContent="space-between" // Thay đổi thành space-between
        alignItems="center"
        p={2}
        sx={{
          height: HEADER_HEIGHT,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        {/* Nút back ở bên trái */}
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ minWidth: 36 }}
        >
          ←
        </Button>

        {/* Các nút view và title ở giữa */}
        <Box display="flex" gap={1} alignItems="center">
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

        {/* Box rỗng để cân bằng layout */}
        <Box sx={{ minWidth: 36 }}></Box>
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
          {" "}
          {noImageForCurrentView ? (
            // Hiển thị thông báo khi không có ảnh
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
                {getViewLabel(view)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Hệ thống chưa cập nhật ảnh
              </Typography>
            </Box>
          ) : (
            <FabricJSCanvas
              className="sample-canvas"
              onReady={onReady}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
