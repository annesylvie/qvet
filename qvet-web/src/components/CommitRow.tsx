import LoadingButton from "@mui/lab/LoadingButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import { Commit } from "src/octokitHelpers";
import UserLink from "src/components/UserLink";
import ShaLink from "src/components/ShaLink";
import useSetCommitState from "src/hooks/useSetCommitState";
import { STATUS_CONTEXT_QA } from "src/queries";
import { grey } from "@mui/material/colors";
import DisplayState from "src/components/DisplayState";
import useCommitStatus from "src/hooks/useCommitStatus";

export default function CommitRow({ commit }: { commit: Commit }) {
  const sha = commit.sha;
  const status = useCommitStatus(sha, STATUS_CONTEXT_QA);

  const [approve, setApprove] = useSetCommitState(
    sha,
    "success",
    STATUS_CONTEXT_QA
  );
  const [deny, setDeny] = useSetCommitState(sha, "failure", STATUS_CONTEXT_QA);
  const [clear, setClear] = useSetCommitState(
    sha,
    "pending",
    STATUS_CONTEXT_QA
  );

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell
        component="th"
        scope="row"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: "500px",
        }}
      >
        {commit.commit.message.split("\n")[0]}
      </TableCell>
      <TableCell>
        {commit.author ? <UserLink user={commit.author} /> : <i>unknown</i>}
      </TableCell>
      <TableCell>
        <ShaLink commit={commit} />
      </TableCell>
      <TableCell style={{ minWidth: "250px" }}>
        {status.isError ? (
          <DisplayStateSkeleton animation={false} />
        ) : status.isLoading ? (
          <DisplayStateSkeleton />
        ) : (
          <DisplayState status={status.data} />
        )}
      </TableCell>
      <TableCell>
        <ButtonGroup>
          <LoadingButton
            title="Mark QA as Completed"
            onClick={setApprove}
            loading={approve.isLoading}
          >
            <DoneIcon />
          </LoadingButton>
          <LoadingButton
            title="Mark QA as Rejected"
            onClick={setDeny}
            loading={deny.isLoading}
          >
            <CloseIcon />
          </LoadingButton>
          <LoadingButton
            title="Reset QA Status"
            style={{ color: grey[400] }}
            onClick={setClear}
            loading={clear.isLoading}
          >
            <ReplayIcon />
          </LoadingButton>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
}

function DisplayStateSkeleton({ ...rest }) {
  return (
    <Skeleton
      animation="wave"
      variant="text"
      width={84}
      height={20}
      {...rest}
    />
  );
}
