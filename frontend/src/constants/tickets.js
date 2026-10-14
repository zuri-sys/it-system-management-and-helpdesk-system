export const emptyTicket = {
  requester_name: "",
  requester_email: "",
  category: "",
  priority: "",
  subject: "",
  description: "",
  status: "Open",
};
export const labels = {
  requester_name: "Requester Name",
  requester_email: "Requester Email",
  category: "Issue Category",
  priority: "Priority",
  subject: "Subject",
  description: "Description",
  status: "Status",
};
export const choices = {
  category: ["Hardware", "Software", "Network", "Account", "Other"],
  priority: ["Low", "Medium", "High", "Urgent"],
  status: ["Open", "In Progress", "Resolved", "Closed"],
};
export const date = (value) => new Date(value).toLocaleString();
