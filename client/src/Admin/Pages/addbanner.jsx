import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import shortid from "shortid";
import toast, { Toaster } from "react-hot-toast";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchBanner, setFetchBanner] = useState(false);
  
  // Zoom functionality states
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  // Fetch all banners on component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/banner/getAllBanners`
        );
        setBanners(response.data.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, [fetchBanner]);

  // Function to delete a banner
  const deleteBanner = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this banner?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/banner/deleteBanner/${id}`,
        { withCredentials: true }
      );
      setBanners(banners.filter((banner) => banner._id !== id));
      alert("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    }
  };

  const handleVisibilityClick = (image) => {
    setSelectedImage(image);
    setIsZoomedIn(true); // Set zoomed in when visibility icon is clicked
  };
  
  const handleImageClick = () => {
    setSelectedImage(null);
    setIsZoomedIn(false); // Reset when zoomed image is clicked
  };

  const handleZoomInClick = () => {
    setIsZoomedIn(true);
  };

  const handleMouseMove = (e) => {
    if (isZoomedIn) {
      const zoomOutIcon = document.getElementById('zoomOutIcon');
      if (zoomOutIcon) {
        zoomOutIcon.style.left = `${e.clientX - 20}px`; // Adjust the offset as needed
        zoomOutIcon.style.top = `${e.clientY - 20}px`;  // Adjust the offset as needed
      }
    }
  };

  const fileSizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
  };

  const handleDeleteDialogOpen = (id, type) => {
    setFileToDelete(id);
    setDeleteType(type);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setFileToDelete(null);
    setDeleteType("");
  };

  const confirmDelete = () => {
    if (deleteType === "selected") {
      setSelectedFile(null);
      setProductImage(null);
    }
    handleDeleteDialogClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedFile) {
      toast.error("Add at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append("productImages", productImage);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN_NAME}/api/banner/addBanner`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Successfully Banner Uploaded!");
      setSelectedFile(null);
      setFetchBanner(!fetchBanner);
      setProductImage(null);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={2}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Banners
            </Typography>
            <Typography variant="body2" sx={{marginBottom:1}}>Banner Size (1920px * 850px)</Typography>
            <div className="file-upload-box">
              <input
                type="file"
                id="fileupload"
                name="productImages"
                className="file-upload-input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedFile({
                        id: shortid.generate(),
                        filename: file.name,
                        filetype: file.type,
                        fileimage: reader.result,
                        datetime: file.lastModifiedDate.toLocaleString("en-IN"),
                        filesize: fileSizes(file.size),
                      });
                    };
                    reader.readAsDataURL(file);
                    setProductImage(file);
                  }
                }}
                accept="image/*"
              />
              <span>
                Drag and drop or{" "}
                <span className="file-link">Choose your file</span>
              </span>
            </div>

            <Grid container spacing={2}>
              {selectedFile && (
                <Grid item xs={12} md={6}>
                  <div className="file-atc-box">
                    <div className="file-image">
                      {selectedFile.filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                        <img src={selectedFile.fileimage} alt="selected image" />
                      ) : (
                        <i className="far fa-file-alt"></i>
                      )}
                    </div>
                    <div className="file-detail">
                      <h6>{selectedFile.filename}</h6>
                      <p>
                        <span>Size : {selectedFile.filesize}</span>
                        <br />
                        <span>Modified Time : {selectedFile.datetime}</span>
                      </p>
                      <div className="file-actions">
                        <button
                          type="button"
                          className="file-action-btn"
                          onClick={() =>
                            handleDeleteDialogOpen(selectedFile.id, "selected")
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} textAlign={"end"} sx={{ marginTop: "20px" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  paddingX: 3,
                  paddingY: 2,
                  backgroundColor: "#475f7b",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  "&:hover": { backgroundColor: "#24303e" },
                }}
                startIcon={<SendIcon />}
                disabled={loading}
              >
                Upload Banner
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this image?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <Toaster position="bottom-center" reverseOrder={true} />
      </form>

      {/* Banners Display */}
    <div>
      <h1>Banners</h1>
      <div className="banner-list">
        {banners.map((banner) => (
          <div key={banner._id} className="banner">
            <div className="banner-images">
              {banner.bannerImages.map((image) => (
                <div key={image.public_id} className="banner-image">
                  <img
                    src={image.url}
                    alt={image.original_filename}
                  />
                  <IconButton
                    sx={{ color: "blue" }}
                    onClick={() => handleVisibilityClick(image.url)}
                    className="visibility-button"
                    aria-label="view"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => deleteBanner(banner._id)}
                    className="delete-button"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {selectedImage && (
      <div className="zoomed-image-container">
        <img
          src={selectedImage}
          alt="Zoomed"
          className={`zoomed-image ${isZoomedIn ? "zoomed-in" : ""}`}
          onClick={handleImageClick}
        />
        {isZoomedIn && (
          <IconButton 
            onClick={handleImageClick}
            className="zoomouticon"
          >
            <ZoomOutIcon />
          </IconButton>
        )}
      </div>
    )}

    </Box>
  );
};

export default AddProduct;
