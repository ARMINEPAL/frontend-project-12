import * as yup from 'yup';

export const getAddChannelSchema = (channels) => yup.object({
    name: yup
      .string()
      .trim()
      .min(3, 'errors.minMax')
      .max(20, 'errors.minMax')
      .notOneOf(
        channels.map((channel) => channel.name),
        'errors.unique',
      )
      .required('errors.required'),
  });
  
export const getRenameChannelSchema = (channels, currentChannelId) => yup.object({
  name: yup
    .string()
    .trim()
    .min(3, 'errors.minMax')
    .max(20, 'errors.minMax')
    .notOneOf(
      channels
        .filter((item) => item.id !== currentChannelId)
        .map((item) => item.name),
      'errors.unique',
    )
    .required('errors.required'),
});