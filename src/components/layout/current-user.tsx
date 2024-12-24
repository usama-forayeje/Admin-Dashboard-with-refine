import { Popover } from "antd";

function CurrentUser() {
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        overlayInnerStyle={{ padding: 0 }}
        overlayStyle={{ zIndex: 999 }}
      >
        USAMA
      </Popover>
    </>
  );
}

export default CurrentUser;
