import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import {
  Button,
  DateRangeToggle,
  FilterBox,
  Input,
  Select,
  Textarea,
  useCheckboxFilterControl,
  useToggleFilterControl,
} from '@daggle-dev/admin-ui';
import type { FilterRowConfig } from '@daggle-dev/admin-ui';

const fruitOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도' },
  { value: 'pineapple', label: '파인애플' },
  { value: 'strawberry', label: '딸기' },
  { value: 'watermelon', label: '수박' },
  { value: 'melon', label: '멜론' },
  { value: 'peach', label: '복숭아' },
  { value: 'pear', label: '배' },
  { value: 'plum', label: '자두' },
  { value: 'cherry', label: '버찌' },
];

export default function App() {
  const [single, setSingle] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const [dateMode, setDateMode] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // FilterBox: 체크박스는 단일 선택, 값 변경 규칙은 훅에서 관리
  const statusControl = useCheckboxFilterControl('all');
  const dateControl = useToggleFilterControl('today');
  const categoryControl = useCheckboxFilterControl('all');
  const targetControl = useToggleFilterControl('all');

  const filterRowsCheckboxOnly: FilterRowConfig[] = [
    {
      key: 'status',
      label: '강의 상태',
      control: {
        type: 'checkbox',
        value: statusControl.value,
        onOptionCheckedChange: statusControl.onOptionCheckedChange,
        options: [
          { value: 'all', label: '전체' },
          { value: 'selling', label: '판매 중' },
          { value: 'waiting', label: '대기 중' },
        ],
      },
    },
  ];

  const filterRowsToggleOnly: FilterRowConfig[] = [
    {
      key: 'date',
      label: '등록일',
      control: {
        type: 'toggle',
        value: dateControl.value,
        onOptionSelect: dateControl.onOptionSelect,
        options: [
          { value: 'today', label: '오늘' },
          { value: 'week', label: '1주일' },
        ],
      },
    },
  ];

  const filterRowsMixed: FilterRowConfig[] = [
    {
      key: 'category',
      label: '카테고리',
      control: {
        type: 'checkbox',
        value: categoryControl.value,
        onOptionCheckedChange: categoryControl.onOptionCheckedChange,
        options: [
          { value: 'all', label: '전체' },
          { value: 'child', label: '유아' },
          { value: 'elementary', label: '초등' },
        ],
      },
    },
    {
      key: 'target',
      label: '대상',
      control: {
        type: 'toggle',
        value: targetControl.value,
        onOptionSelect: targetControl.onOptionSelect,
        options: [
          { value: 'all', label: '전체' },
          { value: 'project', label: '프로젝트' },
          { value: 'study', label: '자기주도스터디' },
        ],
      },
    },
  ];

  const dateOptions = [
    { value: 'all', label: '전체' },
    { value: 'week', label: '일주일' },
    { value: 'month', label: '한달' },
    { value: 'three-month', label: '세달' },
    { value: 'custom', label: '기간 선택' },
  ];

  const filterRowsWithCalendar: FilterRowConfig[] = [
    {
      key: 'registered',
      label: '등록일',
      control: {
        type: 'toggle-calendar',
        options: dateOptions,
        value: dateMode,
        onOptionSelect: setDateMode,
        calendarOptionValue: 'custom',
        range: dateRange,
        onRangeChange: setDateRange,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-30 p-12">
      <h1 className="text-display-sm text-gray-90 mb-8">
        Button Large 사이즈 테스트
      </h1>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="large" variant="default">
          Large (default)
        </Button>
        <Button size="large" variant="fill">
          Large (fill)
        </Button>
        <Button size="large" variant="outline">
          Large (outline)
        </Button>
        <Button size="large" variant="outline-primary">
          Large (outline-primary)
        </Button>
        <Button size="large" variant="destructive">
          Large (destructive)
        </Button>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          Input 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-4 w-96">
          <Input type="text" placeholder="기본 Input" />
          <Input
            type="text"
            label="라벨 있는 Input"
            placeholder="placeholder"
          />
          <Input
            type="text"
            label="필수 입력"
            placeholder="값을 입력하세요"
            aria-invalid
          />
          <Input
            type="text"
            label="이메일"
            placeholder="example@email.com"
            errorMessage="올바른 이메일 형식을 입력해 주세요."
          />
          <Input
            type="text"
            placeholder="에러 메시지만 (라벨 없음)"
            errorMessage="필수 입력 항목입니다."
          />
          <Input type="text" placeholder="Hover/포커스 확인용" />
          <Input type="text" placeholder="Disabled Input" disabled />
          <Input
            type="text"
            placeholder="Error 상태 (aria-invalid만)"
            aria-invalid
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          Textarea 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-[466px]">
          <Textarea placeholder="기본 Textarea" />
          <Textarea
            label="라벨 있는 Textarea"
            placeholder="placeholder"
          />
          <Textarea
            label="의견 입력"
            placeholder="내용을 입력해 주세요."
            ariaLabel="사용자 의견 입력"
          />
          <Textarea
            label="의견"
            placeholder="내용을 입력해 주세요."
            errorMessage="최소 10자 이상 입력해 주세요."
          />
          <Textarea placeholder="Disabled Textarea" disabled />
          <Textarea
            placeholder="Error 상태 (aria-invalid)"
            aria-invalid
          />
          <Textarea
            placeholder="에러 메시지만 (라벨 없음)"
            errorMessage="필수 입력 항목입니다."
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          Select 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-4 w-96">
          <Select
            options={fruitOptions}
            label="단일 선택"
            placeholder="과일을 선택하세요"
            value={single}
            onChange={setSingle}
          />
          <Select
            options={fruitOptions}
            label="다중 선택"
            multiple
            value={multi}
            onChange={setMulti}
            placeholder="여러 개 선택 (Ctrl+클릭)"
          />
          <Select
            options={fruitOptions}
            label="카테고리"
            placeholder="선택하세요"
            errorMessage="항목을 선택해 주세요."
          />
          <Select
            options={fruitOptions}
            placeholder="Disabled"
            disabled
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          FilterBox 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              체크박스 3개만 구성
            </p>
            <FilterBox rows={filterRowsCheckboxOnly} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              토글 2개만 구성
            </p>
            <FilterBox rows={filterRowsToggleOnly} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              혼합 (체크박스 행 + 토글 행)
            </p>
            <FilterBox rows={filterRowsMixed} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              FilterBox 내 등록일 행 (기간 선택 시 캘린더 노출)
            </p>
            <FilterBox rows={filterRowsWithCalendar} />
          </div>
        </div>
      </div>
      <div className='py-[400px]'/>
    </div>
  );
}
