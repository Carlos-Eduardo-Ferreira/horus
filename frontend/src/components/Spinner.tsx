import ClipLoader from "react-spinners/ClipLoader";

interface ISpinnerProps {
  color?: string;
  loading?: boolean;
  size?: number;
}

const Spinner = ({
  color = "#000000",
  loading = true,
  size = 150,
}: ISpinnerProps) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
        aria-label="Loading..."
        data-test-id="loader"
      />
    </div>
  );
};

export { Spinner };