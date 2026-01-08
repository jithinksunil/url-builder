'use client';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput } from './components/TextInput';
import { useState } from 'react';
import { serialize } from './helpers/helpers';
import toast, { Toaster } from 'react-hot-toast';
const schema = yup.object().shape({
  eventBaseUrl: yup.string().required('Please enter event base url').defined(),
  leadId: yup.string(),
  generalPassId: yup.lazy((_, ctx) => {
    if (ctx.parent.requirePreSelectedPass)
      return yup.string().required('Please select a pass');
    return yup.string();
  }),
  selectedPassId: yup.lazy((_, ctx) => {
    if (ctx.parent.requirePreSelectedPass)
      return yup.string().required('Please select a pass');
    return yup.string();
  }),
  activityIdOne: yup.lazy((_, ctx) => {
    if (ctx.parent.requirePreSelectedPass)
      return yup.string().required('Please add an activity');
    return yup.string();
  }),
  activityIdTwo: yup.string(),
  requirePreSelectedPass: yup.boolean().defined(),
  restrictSelectedPassWithSelectedActivities: yup.boolean().defined(),
});

const defaultValues = {
  eventBaseUrl: 'https://app.peakst8.club/event/bismuth-cull',
  leadId: '',
  generalPassId: '4001c046-e99b-4f59-bae1-f8515272abc0',
  selectedPassId: '958d4636-b2d3-4ce1-b4b5-2bbe6982fd0c',
  activityIdOne: '',
  activityIdTwo: '',
  requirePreSelectedPass: false,
  restrictSelectedPassWithSelectedActivities: false,
};
export default function Home() {
  const form = useForm({ resolver: yupResolver(schema), defaultValues });
  const [fullUrl, setFullUrl] = useState('');
  const handleSubmit = (formData: typeof defaultValues) => {
    const parsedObject = encodeURIComponent(
      JSON.stringify({
        nonConflictingActivityIds:
          formData.activityIdOne && formData.activityIdTwo
            ? [formData.activityIdOne, formData.activityIdTwo]
            : formData.activityIdOne
            ? [formData.activityIdOne]
            : formData.activityIdTwo
            ? [formData.activityIdTwo]
            : [],
        conflictingActivityIds: [],
        restrictedPassId: formData.restrictSelectedPassWithSelectedActivities
          ? formData.selectedPassId
          : undefined,
        selectedPass: formData.selectedPassId,
        generalPass: formData.generalPassId,
      })
    );
    setFullUrl(
      `${formData.eventBaseUrl}?${serialize({
        id: formData.leadId,
        parsedObject: formData.requirePreSelectedPass
          ? parsedObject
          : undefined,
      })}`
    );
  };
  const copy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    toast.success('Copied to clipboard');
  };
  const requirePreSelectedPass = form.watch('requirePreSelectedPass');

  return (
    <div className='h-screen flex justify-center items-center flex-col'>
      <FormProvider {...form}>
        <Form
          {...form}
          onSubmit={(handlerData) =>
            handleSubmit(handlerData.data as typeof defaultValues)
          }
          className='flex flex-col gap-4 items-center'
        >
          <TextInput
            name='eventBaseUrl'
            placeholder='https://app.peakst8.club/event/{{eventId}}'
            label='Event Base URL'
          />
          <TextInput name='leadId' placeholder='saasbhoomi' label='Lead ID' />
          <label className='flex gap-2 w-full hover:cursor-pointer'>
            <input
              type='checkbox'
              {...form.register('requirePreSelectedPass')}
            />
            Require Preselected Pass
          </label>
          {requirePreSelectedPass && (
            <>
              <TextInput
                name='selectedPassId'
                placeholder='Category UUID'
                label='Preselected Pass ID'
              />
              <TextInput
                name='activityIdOne'
                placeholder='Activity UUID'
                label='Preselected Activity ID 1'
              />
              <TextInput
                name='activityIdTwo'
                placeholder='Activity UUID'
                label='Preselected Activity ID 2'
              />
              <TextInput
                name='generalPassId'
                placeholder='Category UUID'
                label='General Pass ID'
              />
              <label className='flex gap-2 w-full hover:cursor-pointer'>
                <input
                  type='checkbox'
                  {...form.register(
                    'restrictSelectedPassWithSelectedActivities'
                  )}
                />
                Restrict Selected Pass and selected activities
              </label>
            </>
          )}

          <button className='bg-gray-800 w-[75px] rounded-md py-1 hover:cursor-pointer active:scale-95'>
            Submit
          </button>
        </Form>
      </FormProvider>
      {fullUrl && (
        <>
          <a
            href={fullUrl}
            target='_blank'
            className=' max-w-[700px] wrap-break-word text-center hover:text-blue-500 pb-5 pt-5'
          >
            {fullUrl}
          </a>
          <p
            className='hover:cursor-pointer bg-blue-500 px-2 rounded-md active:scale-95'
            onClick={() => {
              copy();
            }}
          >
            Copy
          </p>
        </>
      )}
      <Toaster />
    </div>
  );
}
