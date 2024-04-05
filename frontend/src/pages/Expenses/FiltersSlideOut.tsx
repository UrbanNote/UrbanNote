import { SlideOut } from '$components';
import type { SlideOutProps } from '$components/SlideOut/SlideOut';

import Filters from './Filters';
import type { FilterProps } from './Filters';

type FiltersSlideOutProps = FilterProps & Pick<SlideOutProps, 'show' | 'setShow'>;

function FiltersSlideOut({ show, setShow, ...props }: FiltersSlideOutProps) {
  return (
    <SlideOut show={show} setShow={setShow} placement="bottom">
      <SlideOut.Body closeBtn>
        <Filters {...props} isVertical />
      </SlideOut.Body>
    </SlideOut>
  );
}

export default FiltersSlideOut;
