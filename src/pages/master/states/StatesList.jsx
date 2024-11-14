import { CardBody, Card, Input } from "@material-tailwind/react";
import {
  CardContent,
  Dialog,
  FormLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdHighlightOff, MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { IconArrowBack, IconCircleX } from "@tabler/icons-react";

const StatesList = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [student, setStudent] = useState({});

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    state_name: "",
    state_country: "",
    state_zone: "",
  });

  const [selected_user_id, setSelectedUserId] = useState("");

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = (e) => {
    e.preventDefault();
    setOpen1(false);
    setUser({
      state_name: "",
      state_country: "",
      state_zone: "",
    });
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/fetch-states`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data.states);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStates();
  }, []);
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);
  const onUserInputChange = (e) => {
    if (e.target.name == "phone") {
      if (validateOnlyDigits(e.target.value)) {
        setUser({
          ...chapter,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
      state_name: user.state_name,
      state_country: user.state_country,
      state_zone: user.state_zone,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/create-states`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Data Source is Created Successfully");
        handleClose(e);
      } else {
        toast.error("Data Source Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating Data Source:", error);
      toast.error("Error updating Data Source");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsButtonDisabled(true);
    const formData = {
      state_name: user.state_name,
      state_country: user.state_country,
      state_zone: user.state_zone,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/update-states/${selected_user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(response.data.states);
        toast.success("Data Source is Updated Successfully");
        handleClose1(e);
      } else {
        toast.error("Data Source Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating Data Source:", error);
      toast.error("Error updating Data Source");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const columns = [
    {
      accessorKey: "sl_no",
      header: "Sl No",
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "state_name",
      header: "State",
    },
    {
      accessorKey: "state_zone",
      header: "State Zone",
    },
    {
      accessorKey: "state_country",
      header: "Country",
    },
    {
      accessorKey: "edit",
      header: "Edit",
      Cell: ({ row }) => (
        <button
          onClick={() => {
            setUser({
              ...user,
              state_name: row.original.state_name,
              state_country: row.original.state_country,
              state_zone: row.original.state_zone,
            });
            setSelectedUserId(row.original.id);
            handleClickOpen1();
          }}
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          Edit
        </button>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: users,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
  });
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2 bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-xl md:text-2xl sm:text-sm text-center md:text-left">
            States
          </h1>

          <div className="flex flex-wrap gap-2 justify-center mt-2 md:mt-0">
            <button
              onClick={handleClickOpen}
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            >
              Create A New Data Source
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <MantineReactTable table={table} />

          <Dialog
            open={open}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
          >
            <form onSubmit={createUser} autoComplete="off">
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Create States
                    </h1>

                    <div className="flex">
                      <Tooltip title="Close">
                        <button
                          type="button"
                          className="ml-3 pl-2"
                          onClick={() => {
                            handleClose();
                          }}
                        >
                          <IconCircleX />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2 p-4 ">
                    <div className="grid grid-cols-1  gap-6 mb-4">
                      <div>
                        <FormLabel required>Enter State</FormLabel>
                        <input
                          name="state_name"
                          value={user.state_name}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel required>Enter State Zone</FormLabel>
                        <input
                          name="state_zone"
                          value={user.state_zone}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel required>Enter Country</FormLabel>
                        <input
                          name="state_country"
                          value={user.state_country}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled}
                        type="submit"
                        className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                      >
                        {isButtonDisabled ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Dialog>

          <Dialog
            open={open1}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
          >
            <form onSubmit={updateUser} autoComplete="off">
              <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-3xl shadow-md">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-slate-800 text-xl font-semibold">
                      Edit Data Source
                    </h1>
                    <div className="flex">
                      <Tooltip title="Close">
                        <button className="ml-3 pl-2 " onClick={handleClose1}>
                          <IconCircleX />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
                      <div>
                        <FormLabel required>Enter State</FormLabel>
                        <input
                          name="state_name"
                          value={user.state_name}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <FormLabel required>Enter State Zone</FormLabel>
                        <input
                          name="state_zone"
                          value={user.state_zone}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <FormLabel required>Enter Country</FormLabel>
                        <input
                          name="state_country"
                          value={user.state_country}
                          onChange={(e) => onUserInputChange(e)}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center">
                      <button
                        disabled={isButtonDisabled}
                        type="submit"
                        className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse md:text-right text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                      >
                        {isButtonDisabled ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default StatesList;