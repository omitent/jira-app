export default class Api {
  public static getJiraTickets() {
    return [
      {
        id: "1",
        ticketNumber: "MI-100",
        content:
          "Cart featureLorem ipsum dolor sit amet, consectetur adipiscing elits.",
        priority: "medium",
        owner: { name: "John" },
      },
      {
        id: "2",
        ticketNumber: "MI-101",
        content:
          "Take ownership of the entire software development lifecycle, from concept to deployment.",
        priority: "high",
        owner: { name: "Mike" },
      },
      {
        id: "3",
        ticketNumber: "MI-102",
        content:
          "Design and implement robust, scalable, and efficient AI software architecture tailored to our business needs.",
        priority: "high",
        owner: { name: "Mike" },
      },
      {
        id: "4",
        ticketNumber: "MI-103",
        content:
          "Develop user-friendly and responsive frontend interfaces, ensuring a seamless user experience.",
        priority: "low",
        owner: { name: "John" },
      },
      {
        id: "5",
        ticketNumber: "MI-104",
        content:
          "Ability to design and optimize algorithms for efficiency and scalability.",
        priority: "medium",
        owner: { name: "Doe" },
      },
      {
        id: "6",
        ticketNumber: "MI-105",
        content:
          "Implement security best practices to safeguard user data and ensure the integrity of the software.",
        priority: "medium",
        owner: { name: "Ashley" },
      },
      {
        id: "7",
        ticketNumber: "MI-106",
        content:
          "Conduct thorough testing of the software to identify and fix bugs, ensuring a stable and reliable product.",
        priority: "medium",
        owner: { name: "Matthew" },
      },
      {
        id: "8",
        ticketNumber: "MI-107",
        content:
          "Strong background in AI and machine learning, with experience in implementing and integrating models into software.",
        priority: "low",
        owner: { name: "John" },
      },
      {
        id: "9",
        ticketNumber: "MI-108",
        content:
          "We pride ourselves in our commitment to providing the highest quality of service, while helping our clients meet their goals.",
        priority: "medium",
        owner: { name: "Ashley" },
      },
      {
        id: "10",
        ticketNumber: "MI-109",
        content:
          "We are currently seeking a skilled and motivated Full Stack Web Developer to join our team.",
        priority: "low",
        owner: { name: "Matthew" },
      },
      {
        id: "12",
        ticketNumber: "MI-111",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "high",
        owner: { name: "Mike" },
      },
      {
        id: "13",
        ticketNumber: "MI-112",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "low",
        owner: { name: "Doe" },
      },
      {
        id: "14",
        ticketNumber: "MI-113",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "medium",
        owner: { name: "John" },
      },
      {
        id: "15",
        ticketNumber: "MI-114",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "high",
        owner: { name: "Doe" },
      },
      {
        id: "16",
        ticketNumber: "MI-115",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "low",
        owner: { name: "Mike" },
      },
      {
        id: "17",
        ticketNumber: "MI-116",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "high",
        owner: { name: "Doe" },
      },
      {
        id: "18",
        ticketNumber: "MI-117",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "medium",
        owner: { name: "Mike" },
      },
      {
        id: "19",
        ticketNumber: "MI-118",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "high",
        owner: { name: "Ashley" },
      },
      {
        id: "20",
        ticketNumber: "MI-119",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "low",
        owner: { name: "Doe" },
      },
      {
        id: "21",
        ticketNumber: "MI-120",
        content:
          "Experience with version control systems, such as Git, for collaborative development.",
        priority: "high",
        owner: { name: "Matthew" },
      },
    ];
  }
  public static updateTicketOwner(ticketId, originOwnerId, newOwnerId) {
    console.log(ticketId, originOwnerId, newOwnerId);
  }
}
