/*
export default function FormUpdateSubmission({
    submission,
    user,
    onChange = () => {},
    handleCloseModalForm,
  }: IFormUpdateStatusSubmissionProps) {
    // Inputs and validators
    const [description, setDescription] = useState<string>(submission.description);
    const [workload, setWorkload] = useState<number>(submission.workload);
    const [details, setDetails] = useState<string>(submission.details || "");
  
    const handleDescription = (value) => {
      setDescription(value);
    };
  
    const handleWorkload = (value) => {
      setWorkload(value);
    };
  
    const handleDetails = (value) => {
      setDetails(value);
    };
  
    // Form state
    const [sent, setSent] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
  
    // Update Submission
    async function handleUpdateSubmission(e) {
      e.preventDefault();
      setSent(true);
  
      fetchUpdateSubmission();
    }
  
    async function fetchUpdateSubmission() {
      setFetching(true);
  
      const options = {
        url: `${process.env.api}/submissions/${submission.id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        data: {
          userId: user.id,
          description,
          workload,
          details,
        },
      };
  
      await axios
        .request(options)
        .then((response) => {
          toast("Success", "Submission updated successfully.", "success");
          onChange();
        })
        .catch((error) => {
          const errorMessage = error?.response?.data?.message || "Oops, something went wrong. Please try again.";
          toast("Error", errorMessage, "danger");
        });
  
      if (handleCloseModalForm) {
        handleCloseModalForm();
      }
  
      setFetching(false);
    }
  
    return (
      <Content>
        <div style={{ width: "100%" }}>
          <SectionTitle>Edit Submission</SectionTitle>
  
          <MultiField>
            <label>Description:</label>
            <TextArea
              name="description"
              value={description}
              handleValue={handleDescription}
              displayAlert={sent}
              maxLength={255}
            />
          </MultiField>
  
          <MultiField>
            <label>Workload:</label>
            <input
              type="number"
              name="workload"
              value={workload}
              onChange={(e) => handleWorkload(parseInt(e.target.value))}
              min={0}
              required
            />
          </MultiField>
  
          <MultiField>
            <label>Details (Optional):</label>
            <TextArea
              name="details"
              value={details}
              handleValue={handleDetails}
              displayAlert={sent}
              maxLength={255}
            />
          </MultiField>
        </div>
  
        <div style={{ width: "100%" }}>
          <>
            {sent && error.length !== 0 && <FormAlert>{error}</FormAlert>}
          </>
  
          <Button onClick={(e) => handleUpdateSubmission(e)}>
            {fetching ? <Spinner size={"20px"} color={"var(--black-1)"} /> : "Update Submission"}
          </Button>
        </div>
      </Content>
    );
  }
  */