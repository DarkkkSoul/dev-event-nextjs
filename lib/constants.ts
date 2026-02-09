export interface Event {
  id: string;
  title: string;
  slug: string;
  image: string;
  location: string;
  date: string;
  time: string;
  description?: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "React Summit 2024",
    slug: "react-summit-2024",
    image: "/images/event1.png",
    location: "San Francisco, CA",
    date: "March 15-17, 2024",
    time: "9:00 AM PST",
    description: "The largest React conference bringing together the global React community"
  },
  {
    id: "2", 
    title: "HackMIT 2024",
    slug: "hackmit-2024",
    image: "/images/event2.png",
    location: "MIT Campus, Cambridge",
    date: "April 6-7, 2024",
    time: "10:00 AM EST",
    description: "MIT's annual hackathon with over 1000 hackers from around the world"
  },
  {
    id: "3",
    title: "PyCon US 2024",
    slug: "pycon-us-2024", 
    image: "/images/event3.png",
    location: "Pittsburgh, PA",
    date: "April 15-23, 2024",
    time: "8:30 AM EDT",
    description: "The largest annual gathering for the Python community"
  },
  {
    id: "4",
    title: "AWS re:Invent",
    slug: "aws-reinvent-2024",
    image: "/images/event4.png", 
    location: "Las Vegas, NV",
    date: "December 2-6, 2024",
    time: "8:00 AM PST",
    description: "Amazon's premier learning conference for the global cloud computing community"
  },
  {
    id: "5",
    title: "Google I/O 2024",
    slug: "google-io-2024",
    image: "/images/event5.png",
    location: "Mountain View, CA", 
    date: "May 14-15, 2024",
    time: "10:00 AM PDT",
    description: "Google's annual developer conference featuring the latest in AI, web, and mobile"
  },
  {
    id: "6",
    title: "DevOps World",
    slug: "devops-world-2024",
    image: "/images/event6.png",
    location: "Orlando, FL",
    date: "September 23-26, 2024", 
    time: "9:00 AM EDT",
    description: "The conference for DevOps practitioners and cloud-native enthusiasts"
  }
];
