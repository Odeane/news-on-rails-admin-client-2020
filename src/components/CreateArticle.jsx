import React, { useState } from "react";
import axios from "axios";
import { Form, Button, TextArea, Input } from "semantic-ui-react";

const CreateArticle = () => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [premiumCategory, setSelectedPremiumCategory] = useState("")
  const [message, setMessage] = useState("")
  const [renderArticleForm, setRenderArticleForm] = useState(false)

  const categoryOptions = [
    { key: "c", text: "Culture", value: "culture" },
    { key: "e", text: "Economy", value: "economy" },
    { key: "i", text: "International", value: "international" },
    { key: "li", text: "Lifestyle", value: "lifestyle" },
    { key: "lo", text: "Local", value: "local" },
    { key: "s", text: "Sports", value: "sports" },
  ];

  const premiumOption = [
    { key: "p", text: "Premium", value: "premium" },
    { key: "f", text: "Free", value: false },
  ]

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const submitArticle = async (event) => {
    event.preventDefault();
    let responseMessage, articleParams, encodedImage, response;
    let { title, lead, content, location, image } = event.target;
    const headers = JSON.parse(localStorage.getItem("J-tockAuth-Storage"));

    try {
      articleParams = {
        title: title.value,
        lead: lead.value,
        content: content.value,
        category: selectedCategory,
        location: location.value,
        premium: premiumCategory
      };

      if (image.files[0]) {
        encodedImage = await toBase64(image.files[0]);
        articleParams.image = encodedImage;
      }

      response = await axios.post(
        "http://localhost:3000/api/v1/admin/articles",
        { article: articleParams },
        { headers: headers }
      );

      responseMessage = response.data.message;
    } catch (error) {
      responseMessage = response.data.error;
    } finally {
      setMessage(responseMessage);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
  }

  const handlePremiumChange = (value) => {
    setSelectedPremiumCategory(value)
  }

  return (
    renderArticleForm ? (
      <>
        <Form onSubmit={submitArticle} id="article-form">
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              placeholder="Title"
              id="title"
              name="title"
              label="Title"
            />
            <Form.Field
              control={Input}
              placeholder="Lead"
              id="lead"
              name="lead"
              label="Lead"
            />
            <Form.Select
              onChange={(event, data) => { handleCategoryChange(data.value) }}
              options={categoryOptions}
              placeholder="Category"
              id="category"
              name="category"
              label="Category"
            />
          </Form.Group>
          <Form.Field
            control={TextArea}
            placeholder="Content"
            id="content"
            name="content"
            label="Content"
          />
          <Form.Field
            control={Input}
            placeholder="Region"
            id="location"
            name="location"
            label="Location"
          />
          <Form.Select
            onChange={(event, data) => { handlePremiumChange(data.value) }}
            options={premiumOption}
            placeholder="Premium or Free"
            id="premium"
            name="premium"
            label="Type"
          />
          <Form.Group>
            <Input id="image-upload" name="image" type="file" />
          </Form.Group>
          <Button type="submit">Save Article</Button>
        </Form><br />
        <Button onClick={() => setRenderArticleForm(false)}>Close form</Button>
        {message && <p id="response-message">{message}</p>}<br />
      </>
    ) : (
        <Button id='create-article' onClick={() => setRenderArticleForm(true)}>Create Article</Button>
      )
  )
}
export default CreateArticle