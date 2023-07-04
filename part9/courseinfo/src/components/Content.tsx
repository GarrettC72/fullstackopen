interface CoursePart {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  parts: CoursePart[];
}

const Part = ({ part }: { part: CoursePart }) => {
  return <p>{part.name} {part.exerciseCount}</p>;
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.parts.map(part =>
        <Part key={part.name} part={part} />
      )}
    </div>
  );
};

export default Content;