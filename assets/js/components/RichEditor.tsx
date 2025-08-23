import ReactQuill from "react-quill-new";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

const RichEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  /* 필요하다면 formats / modules 커스터마이즈 가능 */
  return (
    <ReactQuill
      theme="snow" /* bubble 로 바꿔도 됨   */
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{ height: '300px' }}
    />
  );
};

export default RichEditor;
