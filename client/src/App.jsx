import { useState } from "react";
import ListOfRooms from "./components/ListOfRooms";
import "./App.css";
import MainInfo from "./components/MainInfo";
import { Button, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useFetchPdf from "./utils/useFetchPdf";

function App() {
  const [fileList, setFileList] = useState([]);
  const { text, error, loading, fetchPdf } = useFetchPdf();

  const handleUpload = () => {
    setFileList([]);
    const formData = new FormData();
    fileList.forEach(() => {
      formData.append("pdfFile", fileList[0]);
    });
    fetchPdf(formData);
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  if (error) {
    return error
  }

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div className="uploadField">
          <Upload
            onClick={() => setFileList([])}
            {...props}
            listType="picture-card"
            className="avatar-uploader"
            name="avatar"
          >
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                PDF File
              </div>
            </div>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            style={{ width: "102px" }}
          >
            Upload
          </Button>
        </div>
        <div className="info">
          <MainInfo text={text} />
        </div>
      </div>
      <div className="content">
        {loading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          <ListOfRooms text={text} />
        )}
      </div>
    </div>
  );
}

export default App;
