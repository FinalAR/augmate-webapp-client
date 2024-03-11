import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Card, CardBody, CardTitle, Col, Row, Button } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import bg1 from "../../assets/images/bg/bg1.jpg";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import UploadComponent from "../../components/contentUploader";
import axios from "axios";
import getApiUrl from "../../utility/apiUtils";

const ContentUpload = () => {
    const location = useLocation();
    const data = location.state; // Ensure you're using this data correctly within your component.
    var [contentCount, setContentCount] = useState(1);
    const MAX_FILE_SIZE = 104857600; // Example: 100MB in bytes
    const [initalUpload, setInitUpload] = useState(true);

    const validationSchema = Yup.object().shape({
        content_name: Yup.string().required("Content name is required"),
        contentImage: Yup.mixed().required("Content image file is required"),
        high_quality: Yup.object().shape({
            fileSize: Yup.number().required("File size is required").positive("File size must be positive"),
            scale: Yup.number().required("Scale is required").positive("Scale must be positive"),
            polygon_count: Yup.number().required("Polygon count is required").integer("Polygon count must be an integer").positive("Polygon count must be positive"),
            file: Yup.mixed().required("File is required")
        }),
        mid_quality: Yup.object().shape({
            fileSize: Yup.number().required("File size is required").positive("File size must be positive"),
            scale: Yup.number().required("Scale is required").positive("Scale must be positive"),
            polygon_count: Yup.number().required("Polygon count is required").integer("Polygon count must be an integer").positive("Polygon count must be positive"),
            file: Yup.mixed().required("File is required")
        }),
        low_quality: Yup.object().shape({
            fileSize: Yup.number().required("File size is required").positive("File size must be positive"),
            scale: Yup.number().required("Scale is required").positive("Scale must be positive"),
            polygon_count: Yup.number().required("Polygon count is required").integer("Polygon count must be an integer").positive("Polygon count must be positive"),
            file: Yup.mixed().required("File is required")
        }),
    });
    console.log(data);
    function handleContentUpload(values) {
        if(data.contentCount){
            axios.post(getApiUrl(`content/create/${data.docID}`), {
                contentImage: values.contentImage,
                contents: {
                    high: { animationRate: '', contentPath: '', polygonCount: '', size: '' },
                    low: { contentPath: '', size: '', polygonCount: '', animationRate: '' },
                    mid: { contentPath: '', size: '', polygonCount: '', animationRate: '' }
                },
                size: "",
                flag: true,
                ref_ver: 1,
              })
                .then((response) => {
                  console.log(response);
                }, (error) => {
                  console.log(error);
                });
        }else{
            axios.post(getApiUrl('content/create'), {
                targetpHash: data.targetpHash,
                targetImage: data.image,
                contentImage: values.contentImage,
                contentPath: "",
                description: data.imageName,
                analysis: {},
                contents: {
                    high: { animationRate: '', contentPath: '', polygonCount: '', size: '' },
                    low: { contentPath: '', size: '', polygonCount: '', animationRate: '' },
                    mid: { contentPath: '', size: '', polygonCount: '', animationRate: '' }
                },
                positionY: "",
                scaleSet: "",
                size: "",
                flag: false,
                ref_ver: 1,
                imageTargetSrc: data.imageTargetSrc
              })
                .then((response) => {
                  console.log(response);
                }, (error) => {
                  console.log(error);
                });
        }
        // setInitUpload(false);
        // console.log(values);
    }

    const [progress, setProgress] = useState(0);

    const handleImage = async (file, values) => {
      setProgress(0)
      if (file == null) {
        return;
      } else {
        const currentDate = new Date();
        const imageRef = storageRef(storage, `contents/${currentDate.getTime()}_${file.name}`);
        await uploadBytes(imageRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                setProgress(100);
                console.log(url);
                setContentImageFieldValue(values,url);
              })
              .catch((error) => {
                console.log(error.message);
              });
          })
          .catch((error) => {
            console.log(error.message);
            // toastifyError(error.message);
          });
      }
    }

    const setContentImageFieldValue = (props, url) =>{
        props.setFieldValue("contentImage", url);
    }

    const initialValues = {
        content_name: "",
        contentImage: null,
        high_quality: {
            fileSize: "", // Consider changing this to a numeric type if you're validating as a number.
            scale: "",
            polygon_count: "",
            file: null
        },
        mid_quality: {
            fileSize: "", // Consider changing this to a numeric type if you're validating as a number.
            scale: "",
            polygon_count: "",
            file: null
        },
        low_quality: {
            fileSize: "", // Consider changing this to a numeric type if you're validating as a number.
            scale: "",
            polygon_count: "",
            file: null
        }
    }

    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h2" className="border-bottom p-3 mb-0">
                        {data.title}
                    </CardTitle>
                    <CardBody>
                        <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: 20 }}>
                            <img src={data.image} alt="Target Image" style={{ width: "300px", height: "300px", objectFit: "cover" }} />
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={async (values) => {
                                handleContentUpload(values);
                                // await new Promise((r) => setTimeout(r, 500));
                                // alert(JSON.stringify(values, null, 2));
                            }}
                        >
                            {(values) => (
                                <Form>
                                    <div>
                                        <div className="row">
                                            <div style={{ height: "1px", width: "100%", backgroundColor: "#c7c7c7", marginTop: "20px", marginBottom: "20px" }}></div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="content_name">Content name</label>
                                                    <Field
                                                        name="content_name"
                                                        placeholder="Enter the content name"
                                                        type="text"
                                                        className={`mt-2 form-control ${values.touched.content_name && values.errors.content_name ? "is-invalid" : ""}`}
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="content_name"
                                                        className="invalid-feedback"
                                                    />
                                                    <label></label>
                                                </div>
                                                <div className="form-group">
                                                    <label>Image target</label>
                                                    <input
                                                        type="file"
                                                        name="contentImage"
                                                        placeholder="Upload image target"
                                                        onChange={async (e) => {
                                                            await handleImage(e.target.files[0], values);
                                                        }}
                                                        className={`mt-2 form-control ${values.touched.contentImage && values.errors.contentImage ? "is-invalid" : ""}`}
                                                    />
                                                    <progress value={progress} max={100} />
                                                    <span>{progress}%</span>
                                                    <ErrorMessage
                                                        component="div"
                                                        name="contentImage"
                                                        className="invalid-feedback"
                                                    />
                                                </div>

                                                 {/* ========================== High quality content ====================== */}
                                                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                                    <h5 style={{ fontWeight: "bolder", fontSize: "16" }}>AR content with highest quality</h5>
                                                </div>

                                                <div>
                                                    <div className="form-group">
                                                        <label>Content file size</label>
                                                        <Field type="number" name="high_quality.fileSize" placeholder="Enter the size of file" className={`mt-2 form-control ${values.touched.high_quality?.fileSize && values.errors.high_quality?.fileSize ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="high_quality.fileSize" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Content the polygon count</label>
                                                        <Field type="number" name="high_quality.polygon_count" placeholder="Enter the polygon count" className={`mt-2 form-control ${values.touched.high_quality?.polygon_count && values.errors.high_quality?.polygon_count ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="high_quality.polygon_count" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Content the Scale</label>
                                                        <Field type="number" name="high_quality.scale" placeholder="Enter the Scale" className={`mt-2 form-control ${values.touched.high_quality?.scale && values.errors.high_quality?.scale ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="high_quality.scale" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Upload the content with highest quality</label>
                                                        <UploadComponent validationProps={values} fieldName="high_quality.file"/>
                                                        <label></label>
                                                    </div>
                                                </div>

                                                {/* ========================== mid quality content ====================== */}
                                                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                                    <h5 style={{ fontWeight: "bolder", fontSize: "16" }}>AR content with mid quality</h5>
                                                </div>
                                                <div>
                                                    <div className="form-group">
                                                        <label>Content file size</label>
                                                        <Field type="number" name="mid_quality.fileSize" placeholder="Enter the size of file" className={`mt-2 form-control ${values.touched.mid_quality?.fileSize && values.errors.mid_quality?.fileSize ? "is-invalid" : ""}`}  />
                                                        <ErrorMessage name="mid_quality.fileSize" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Content the polygon count</label>
                                                        <Field type="number" name="mid_quality.polygon_count" placeholder="Enter the polygon count" className={`mt-2 form-control ${values.touched.mid_quality?.polygon_count && values.errors.mid_quality?.polygon_count ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="mid_quality.polygon_count" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Content the Scale</label>
                                                        <Field type="number" name="mid_quality.scale" placeholder="Enter the Scale" className={`mt-2 form-control ${values.touched.mid_quality?.scale && values.errors.mid_quality?.scale ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="mid_quality.scale" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Upload the content with mid quality</label>
                                                        <UploadComponent validationProps={values} fieldName="mid_quality.file"/>
                                                        <label></label>
                                                    </div>
                                                </div>

                                                {/* ========================== low quality content ====================== */}
                                                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                                    <h5 style={{ fontWeight: "bolder", fontSize: "16" }}>AR content with lowest quality</h5>
                                                </div>
                                                <div>
                                                    <div className="form-group">
                                                        <label>Content file size</label>
                                                        <Field type="number" name="low_quality.fileSize" placeholder="Enter the size of file" className={`mt-2 form-control ${values.touched.low_quality?.fileSize && values.errors.low_quality?.fileSize ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="low_quality.fileSize" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Content the polygon count</label>
                                                        <Field type="number" name="low_quality.polygon_count" placeholder="Enter the polygon count" className={`mt-2 form-control ${values.touched.low_quality?.polygon_count && values.errors.low_quality?.polygon_count ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="low_quality.polygon_count" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Content the Scale</label>
                                                        <Field type="text" name="low_quality.scale" placeholder="Enter the Scale" className={`mt-2 form-control ${values.touched.low_quality?.scale && values.errors.low_quality?.scale ? "is-invalid" : ""}`} />
                                                        <ErrorMessage name="low_quality.scale" className="invalid-feedback" component="div" />
                                                        <label></label>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Upload the content with lowest quality</label>
                                                        <UploadComponent validationProps={values} fieldName="low_quality.file"/>
                                                        <label></label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div style={{ display: "flex", width: "50%", flexDirection: "row" }}>
                                            <Button
                                                type="submit"
                                                className="btn"
                                                color="success"
                                                style={{ marginInline: "10px" }}
                                            >
                                                {initalUpload ? "Confim" : "Add another content"}
                                            </Button>
                                            <Button type="submit" className="btn" color="danger">Cancel</Button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default ContentUpload;
