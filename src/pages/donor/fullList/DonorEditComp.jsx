import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import BASE_URL from "../../../base/BaseUrl";
import AddToGroup from "./AddToGroup";
import honorific from "../../../utils/Honorific";
import donor_type from "../../../utils/DonorType";
import belongs_to from "../../../utils/BelongTo";
import company_type from "../../../utils/CompanyType";
import { IconArrowBack } from "@tabler/icons-react";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  DONOR_COMPANY_EDIT_FETCH,
  DONOR_COMPANY_FAMILY_GROUP_UPDATE,
  DONOR_COMPANY_UPDATE_SUMBIT,
} from "../../../api";
const gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];

const csr = [
  {
    value: "0",
    label: "No",
  },
  {
    value: "1",
    label: "Yes",
  },
];

const corrpreffer = [
  {
    value: "Registered",
    label: "Registered",
  },
  {
    value: "Branch Office",
    label: "Branch Office",
  },
  {
    value: "Digital",
    label: "Digital",
  },
];

const DonorEditComp = ({ id, isPanelUp }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
 const [errors, setErrors] = useState({});
  const [donor, setDonor] = useState({
    indicomp_full_name: "",
    title: "",
    indicomp_com_contact_name: "",
    indicomp_com_contact_designation: "",
    indicomp_gender: "",
    indicomp_dob_annualday: "",
    indicomp_pan_no: "",
    indicomp_image_logo: "",
    indicomp_remarks: "",
    indicomp_promoter: "",
    indicomp_newpromoter: "",
    indicomp_belongs_to: "",
    indicomp_source: "",
    indicomp_donor_type: "",
    indicomp_csr: "",
    indicomp_type: "",
    indicomp_mobile_phone: "",
    indicomp_mobile_whatsapp: "",
    indicomp_email: "",
    indicomp_website: "",
    indicomp_res_reg_address: "",
    indicomp_res_reg_area: "",
    indicomp_res_reg_ladmark: "",
    indicomp_res_reg_city: "",
    indicomp_res_reg_state: "",
    indicomp_res_reg_pin_code: "",
    indicomp_off_branch_address: "",
    indicomp_off_branch_area: "",
    indicomp_off_branch_ladmark: "",
    indicomp_off_branch_city: "",
    indicomp_off_branch_state: "",
    indicomp_off_branch_pin_code: "",
    indicomp_corr_preffer: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [family_related_id, setFamilyRelatedId] = useState("");

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "indicomp_mobile_phone") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "indicomp_mobile_whatsapp") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "indicomp_res_reg_pin_code") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "indicomp_off_branch_pin_code") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setDonor({
        ...donor,
        [e.target.name]: e.target.value,
      });
    }
  };

  // const onChangePanNumber = (e) => {
  //   setDonor({ ...donor, indicomp_pan_no: e.target.value });
  // };
  const onChangePanNumber = (e) => {
    // const panValue = e.target.value.toUpperCase().replace(/\s/g, '');
    const panValue = e.target.value;
    setDonor({ ...donor, indicomp_pan_no: panValue });
  };
  //   for modal

  const [showmodal, setShowmodal] = useState(false);
  const closegroupModal = () => {
    setShowmodal(false);
  };
  const openmodal = () => {
    setShowmodal(true);
  };

  const familyGroupStatus = (status) => {
    let data = {};

    if (status == "add_to_family_group") {
      data = {
        indicomp_related_id: family_related_id,
      };
    } else {
      data = {
        leave_family_group: true,
      };
    }

    axios({
      url: DONOR_COMPANY_FAMILY_GROUP_UPDATE + id,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setDonor(res.data.individualCompany);

        setShowmodal(false);
        navigate("/donor-list");
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
        setIsButtonDisabled(false);
      } else {
        toast.error("Unexcepted Error");
        setIsButtonDisabled(false);
      }
    });
  };

  const fetchEditComp = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${DONOR_COMPANY_EDIT_FETCH}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonor(response.data?.individualCompany);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };

  const [states, setStates] = useState([]);
  const fetchStateData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-states`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStates(response.data?.states);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };
  const [datasource, setDatasource] = useState([]);
  const fetchDataSource = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-datasource`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDatasource(response.data?.datasource);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };
  const [promoter, setPromoters] = useState([]);
  const fetchPromoter = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-promoter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPromoters(response.data?.promoter);
    } catch (error) {
      console.error("Error fetching Life Time data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStateData();
    fetchDataSource();
    fetchPromoter();
    fetchEditComp();
  }, []);
  useEffect(() => {
    let timeoutId;
    timeoutId = setTimeout(() => {
      if (isPanelUp.error == "Maintenance") {
        localStorage.clear();
        navigate("/maintenance");
      }
    }, 5000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPanelUp, navigate]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!donor.indicomp_full_name?.trim()) {
      newErrors.indicomp_full_name = "Company Name is required";
      isValid = false;
    }

    if (!donor.indicomp_type) {
      newErrors.indicomp_type = "Company Type is required";
      isValid = false;
    }
    if (!donor.indicomp_com_contact_name) {
      newErrors.indicomp_com_contact_name = "Contact Name is required";
      isValid = false;
    }

    if (!donor.title) {
      newErrors.title = "Title is required";
      isValid = false;
    }

   

    if (!donor.indicomp_gender) {
      newErrors.indicomp_gender = "Gender is required";
      isValid = false;
    }

    if (
      !donor.indicomp_pan_no ||
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(donor.indicomp_pan_no)
    ) {
      newErrors.indicomp_pan_no =
        "Valid PAN Number is required (format: AAAAA9999A)";
      isValid = false;
    }

    if (!donor.indicomp_promoter) {
      newErrors.indicomp_promoter = "Promoter is required";
      isValid = false;
    }

    if (
      donor.indicomp_promoter === "Other" &&
      !donor.indicomp_newpromoter?.trim()
    ) {
      newErrors.indicomp_newpromoter = "Please specify promoter";
      isValid = false;
    }

    if (
      !donor.indicomp_mobile_phone ||
      !/^\d{10}$/.test(donor.indicomp_mobile_phone)
    ) {
      newErrors.indicomp_mobile_phone =
        "Valid 10-digit Mobile Number is required";
      isValid = false;
    }

    if (!donor.indicomp_res_reg_city?.trim()) {
      newErrors.indicomp_res_reg_city = "City is required";
      isValid = false;
    }

    if (!donor.indicomp_res_reg_state) {
      newErrors.indicomp_res_reg_state = "State is required";
      isValid = false;
    }

    if (
      !donor.indicomp_res_reg_pin_code ||
      !/^\d{6}$/.test(donor.indicomp_res_reg_pin_code)
    ) {
      newErrors.indicomp_res_reg_pin_code = "Valid 6-digit Pincode is required";
      isValid = false;
    }

    if (!donor.indicomp_corr_preffer) {
      newErrors.indicomp_corr_preffer = "Correspondence Preference is required";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      setIsButtonDisabled(false);
      return;
    }

    try {
      const data = {
        indicomp_full_name: donor.indicomp_full_name,
        title: donor.title,
        indicomp_type: donor.indicomp_type,
        indicomp_com_contact_name: donor.indicomp_com_contact_name,
        indicomp_com_contact_designation:
          donor.indicomp_com_contact_designation,
        indicomp_gender: donor.indicomp_gender,
        indicomp_dob_annualday: donor.indicomp_dob_annualday,
        indicomp_pan_no: donor.indicomp_pan_no,
        indicomp_image_logo: donor.indicomp_image_logo,
        indicomp_remarks: donor.indicomp_remarks,
        indicomp_promoter: donor.indicomp_promoter,
        indicomp_newpromoter: donor.indicomp_newpromoter,
        indicomp_source: donor.indicomp_source,
        indicomp_csr: donor.indicomp_csr,
        indicomp_mobile_phone: donor.indicomp_mobile_phone,
        indicomp_mobile_whatsapp: donor.indicomp_mobile_whatsapp,
        indicomp_email: donor.indicomp_email,
        indicomp_website: donor.indicomp_website,
        indicomp_res_reg_address: donor.indicomp_res_reg_address,
        indicomp_res_reg_area: donor.indicomp_res_reg_area,
        indicomp_res_reg_ladmark: donor.indicomp_res_reg_ladmark,
        indicomp_res_reg_city: donor.indicomp_res_reg_city,
        indicomp_res_reg_state: donor.indicomp_res_reg_state,
        indicomp_res_reg_pin_code: donor.indicomp_res_reg_pin_code,
        indicomp_off_branch_address: donor.indicomp_off_branch_address,
        indicomp_off_branch_area: donor.indicomp_off_branch_area,
        indicomp_off_branch_ladmark: donor.indicomp_off_branch_ladmark,
        indicomp_off_branch_city: donor.indicomp_off_branch_city,
        indicomp_off_branch_state: donor.indicomp_off_branch_state,
        indicomp_off_branch_pin_code: donor.indicomp_off_branch_pin_code,
        indicomp_corr_preffer: donor.indicomp_corr_preffer,
        indicomp_belongs_to: donor.indicomp_belongs_to,
        indicomp_donor_type: donor.indicomp_donor_type,
      };

      setIsButtonDisabled(true);
      const response = await axios({
        url: DONOR_COMPANY_UPDATE_SUMBIT + `${id}`,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code === 200) {
        navigate("/donor-list");

        toast.success(response.data.msg);
      } else if (response.data.code === 400) {
        toast.error(response.data.msg);
      } else {
        toast.error("Unexpected Error");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred during updating");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500";
  return (
    <div className="  bg-[#FFFFFF] p-2    rounded-lg  ">
      <div className="sticky top-0 p-2  mb-4 border-b-2 border-green-500 rounded-lg  bg-[#E1F5FA] ">
        <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
          <div className="flex  items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>Edit Company</span>
          </div>
          <IconArrowBack
            onClick={() => navigate("/donor-list")}
            className="cursor-pointer hover:text-red-600"
          />
        </h2>
      </div>
      <hr />
      <form
     
        className="w-full max-w-7xl  rounded-lg mx-auto p-6 space-y-8 "
        autoComplete="off"
      >
        {/* Personal Details Section */}
        <div>
          <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Personal Details</span>
          </h2>

          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <FormLabel required>Company Name</FormLabel>
              <input
                type="text"
                name="indicomp_full_name"
                value={donor.indicomp_full_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Please don't add M/s before name
              </p>
              {errors?.indicomp_full_name && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_full_name}</p>
  )}
            </div>

            <div>
              <FormLabel required>Type</FormLabel>
              <select
                name="indicomp_type"
                value={donor.indicomp_type}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Company Type</option>
                {company_type.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors?.indicomp_type && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_type}</p>
  )}
            </div>

            <div>
              <FormLabel required>Title</FormLabel>
              <select
                name="title"
                value={donor.title}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Title</option>
                {honorific.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors?.title && (
    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
  )}
            </div>

            <div>
              <FormLabel required>Contact Name</FormLabel>
              <input
                type="text"
                name="indicomp_com_contact_name"
                value={donor.indicomp_com_contact_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
                 {errors?.indicomp_com_contact_name && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_com_contact_name}</p>
  )}
            </div>

            <div>
              <FormLabel>Designation</FormLabel>
              <input
                type="text"
                name="indicomp_com_contact_designation"
                value={donor.indicomp_com_contact_designation}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel required>Gender</FormLabel>
              <select
                name="indicomp_gender"
                value={donor.indicomp_gender}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select gender</option>
                {gender.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.indicomp_gender && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_gender}</p>
  )}
            </div>

            <div>
              <FormLabel>Annual Day</FormLabel>
              <input
                type="date"
                name="indicomp_dob_annualday"
                value={donor.indicomp_dob_annualday}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <InputMask
                mask="aaaaa9999a"
                formatChars={{
                  9: "[0-9]",
                  a: "[A-Z]",
                }}
                value={donor.indicomp_pan_no}
                onChange={(e) => onChangePanNumber(e)}
              >
                {() => (
                  <div>
                    <FormLabel required>PAN Number</FormLabel>
                    <input
                      type="text"
                      label="PAN Number"
                      name="panNumber"
                      required
                      className={inputClass}
                    />
                  </div>
                )}
              </InputMask>
              {errors?.indicomp_pan_no && (
        <p className="text-red-500 text-xs mt-1">{errors.indicomp_pan_no}</p>
      )}
            </div>

            <div>
              <FormLabel>Upload Logo</FormLabel>
              <input
                type="file"
                name="indicomp_image_logo"
                disabled
                value={donor.indicomp_image_logo}
                onChange={(e) => onInputChange(e)}
                className="w-full px-3 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-[#E1F5FA] file:text-black cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Upload Company Logo</p>
            </div>

            <div>
              <FormLabel>Remarks</FormLabel>
              <input
                type="text"
                name="indicomp_remarks"
                value={donor.indicomp_remarks}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel required>Promoter</FormLabel>
              <select
                name="indicomp_promoter"
                value={donor.indicomp_promoter}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Promoter</option>
                {promoter.map((option) => (
                  <option
                    key={option.indicomp_promoter}
                    value={option.indicomp_promoter}
                  >
                    {option.indicomp_promoter}
                  </option>
                ))}
              </select>
              {errors?.indicomp_promoter && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_promoter}</p>
  )}
            </div>

            {donor.indicomp_promoter === "Other" && (
              <div>
                <>
                  <FormLabel>Promoter</FormLabel>
                  <input
                    type="text"
                    name="indicomp_newpromoter"
                    value={donor.indicomp_newpromoter}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                  />
                </>
              </div>
            )}

            <div>
              <FormLabel>Belong To</FormLabel>
              <select
                name="indicomp_belongs_to"
                value={donor.indicomp_belongs_to}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select Belong To</option>
                {belongs_to.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel>Source</FormLabel>
              <select
                name="indicomp_source"
                value={donor.indicomp_source}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select Source</option>
                {datasource.map((option) => (
                  <option key={option.id} value={option.data_source_type}>
                    {option.data_source_type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel>Donor Type</FormLabel>
              <select
                name="indicomp_donor_type"
                value={donor.indicomp_donor_type}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select Donor Type</option>
                {donor_type.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel>CSR</FormLabel>
              <select
                name="indicomp_csr"
                value={donor.indicomp_csr}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select CSR</option>
                {csr.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Communication Details Section */}
        <div>
          <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Communication Details</span>
          </h2>

          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <FormLabel required>Mobile Phone</FormLabel>
              <input
                type="tel"
                name="indicomp_mobile_phone"
                value={donor.indicomp_mobile_phone}
                onChange={(e) => onInputChange(e)}
                maxLength={10}
                className={inputClass}
                required
              />
                {errors?.indicomp_mobile_phone && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_mobile_phone}</p>
  )}
            </div>

            <div>
              <FormLabel>WhatsApp</FormLabel>
              <input
                type="tel"
                name="indicomp_mobile_whatsapp"
                value={donor.indicomp_mobile_whatsapp}
                onChange={(e) => onInputChange(e)}
                maxLength={10}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>Email</FormLabel>
              <input
                type="email"
                name="indicomp_email"
                value={donor.indicomp_email}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>Website</FormLabel>
              <input
                type="text"
                name="indicomp_website"
                value={donor.indicomp_website}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
        {/* Residence Address Section */}
        <div>
          <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Registered Address</span>
          </h2>
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel>House & Street Number</FormLabel>
              <input
                type="text"
                name="indicomp_res_reg_address"
                value={donor.indicomp_res_reg_address}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>Area</FormLabel>
              <input
                type="text"
                name="indicomp_res_reg_area"
                value={donor.indicomp_res_reg_area}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>Landmark</FormLabel>
              <input
                type="text"
                name="indicomp_res_reg_ladmark"
                value={donor.indicomp_res_reg_ladmark}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel required>City</FormLabel>
              <input
                type="text"
                name="indicomp_res_reg_city"
                value={donor.indicomp_res_reg_city}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClass}
              />
                   {errors?.indicomp_res_reg_city && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_res_reg_city}</p>
  )}
            </div>

            <div>
              <FormLabel required>State</FormLabel>
              <select
                name="indicomp_res_reg_state"
                value={donor.indicomp_res_reg_state}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>
              {errors?.indicomp_res_reg_state && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_res_reg_state}</p>
  )}
            </div>

            <div>
              <FormLabel required>Pincode</FormLabel>
              <input
                type="text"
                name="indicomp_res_reg_pin_code"
                value={donor.indicomp_res_reg_pin_code}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
                required
                className={inputClass}
              />
                {errors?.indicomp_res_reg_pin_code && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_res_reg_pin_code}</p>
  )}
            </div>
          </div>
        </div>
        {/* Branch Office Address Section */}
        <div>
          <h2 className=" px-5 text-[black] text-sm mb-2 flex flex-row gap-2 items-center  rounded-xl p-4 bg-[#E1F5FA]">
            <IconInfoCircle className="w-4 h-4" />
            <span>Branch Office Address</span>
          </h2>
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <FormLabel>Office & Street Number</FormLabel>
              <input
                type="text"
                name="indicomp_off_branch_address"
                value={donor.indicomp_off_branch_address}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>Area</FormLabel>
              <input
                type="text"
                name="indicomp_off_branch_area"
                value={donor.indicomp_off_branch_area}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>Landmark</FormLabel>
              <input
                type="text"
                name="indicomp_off_branch_ladmark"
                value={donor.indicomp_off_branch_ladmark}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>City</FormLabel>
              <input
                type="text"
                name="indicomp_off_branch_city"
                value={donor.indicomp_off_branch_city}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel>State</FormLabel>
              <select
                name="indicomp_off_branch_state"
                value={donor.indicomp_off_branch_state}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.state_name}>
                    {state.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel>Pincode</FormLabel>
              <input
                type="text"
                name="indicomp_off_branch_pin_code"
                value={donor.indicomp_off_branch_pin_code}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel required>Correspondence Preference</FormLabel>
              <select
                name="indicomp_corr_preffer"
                value={donor.indicomp_corr_preffer}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Corrpreffer</option>
                {corrpreffer.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.indicomp_corr_preffer && (
    <p className="text-red-500 text-xs mt-1">{errors.indicomp_corr_preffer}</p>
  )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 sm:justify-center md:justify-start items-center">
          <button
            type="submit"
            onClick={(e)=>handleUpdate(e)}
            color="blue"
            disabled={isButtonDisabled}
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md px-6 py-2"
          >
            {isButtonDisabled ? "Updating..." : "Update"}
          </button>

          {donor.indicomp_related_id == donor.indicomp_fts_id ? (
            <button
              onClick={() => openmodal()}
              type="button"
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            >
              Attach to Group
            </button>
          ) : (
            <button
              disabled
              onClick={() => openmodal()}
              type="button"
              className="text-center text-sm font-[400] cursor-not-allowed hover:animate-pulse w-36 text-white bg-blue-100 hover:bg-green-100 p-2 rounded-lg shadow-md"
            >
              Attach to Group
            </button>
          )}

          {donor.indicomp_related_id == donor.indicomp_fts_id ? (
            <button
              disabled
              type="button"
              className="text-center text-sm font-[400] cursor-not-allowed hover:animate-pulse w-36 text-white bg-blue-100 hover:bg-green-100 p-2 rounded-lg shadow-md"
            >
              Leave Group
            </button>
          ) : (
            <button
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              color="info"
              type="button"
              onClick={() => familyGroupStatus("leave_family_group")}
            >
              Leave Group
            </button>
          )}
          <button
            type="button"
            className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
            onClick={() => {
              navigate("/donor-list");
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      <Dialog open={showmodal} toggle={() => closegroupModal()}>
        <DialogBody>
          <AddToGroup id={donor.id} closegroupModal={closegroupModal} />
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default DonorEditComp;
