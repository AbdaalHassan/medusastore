import React, { useState, useEffect } from "react";
import type { SettingConfig } from "@medusajs/admin";
import type { SettingProps } from "@medusajs/admin-ui";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
// import {Modal} from "react-modal";
import {
  AdminFAQsReq,
  AdminFAQsRes,
  AdminFAQsDel,
  AdminFAQsUpdate,
} from "src/admin/types";
import {
  PlusMini,
  EllipsisHorizontal,
  PencilSquare,
  Trash,
} from "@medusajs/icons";
import {
  Button,
  Label,
  Table,
  DropdownMenu,
  Drawer,
  Container,
  Input,
  Textarea,
} from "@medusajs/ui";
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const StoreContacts = ({ notify }: SettingProps) => {
  const { data, isLoading, refetch, isFetched } = useAdminCustomQuery(
    "/admin/faqs",
    ["get_FAQs"]
  );
  const { mutate } = useAdminCustomPost<AdminFAQsReq, AdminFAQsRes>(
    `/admin/FAQs`,
    ["FAQs-create"]
  );

  const { mutate: updateFaqsMutate } = useAdminCustomPost<
    AdminFAQsUpdate,
    AdminFAQsRes
  >(`/admin/updateFAQs`, ["FAQs-update"]);

  const { mutate: deleteFaqMutate } = useAdminCustomPost<
    AdminFAQsDel,
    AdminFAQsRes
  >(`/admin/deleteFaq`, ["FAQs-delete"]);

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const [editedFAQ, setEditedFAQ] = useState<FAQ | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Add FAQ's
  const handleAddFaqs = () => {
    if (question !== "" && answer !== "") {
      try {
        if (editedFAQ) {
          SaveFAQs();
        } else {
          mutate(
            { question, answer },
            {
              onSuccess: () => {
                notify.success("Success", "Information saved");
                setIsModalOpen(false);
                setQuestion("");
                setAnswer("");
                refetch();
              },
              onError: (error) => {
                notify.error("Error", error.name);
              },
            }
          );
        }
      } catch (error) {
        notify.error("Error saving FAQ:", error);
      }
    }
  };

  //   Delete FAQs
  const handleDeleteFaq = async (id) => {
    try {
      await deleteFaqMutate({ id });
      notify.success("Sucess:", "FAQ deleted successfully!");
      refetch();
    } catch (error) {
      notify.error("Error deleting FAQ:", error);
    }
  };

  // Update FAQs
  const handleUpdateFaqs = (updatedFAQ: FAQ) => {
    setIsModalOpen(true);
    setEditedFAQ(updatedFAQ);
    setQuestion(updatedFAQ.question);
    setAnswer(updatedFAQ.answer);
  };
  const SaveFAQs = () => {
    if (question !== "" && answer !== "") {
      try {
        const { id } = editedFAQ;
        updateFaqsMutate(
          { id, question, answer },
          {
            onSuccess: () => {
              notify.success("Success", "Information Updated");
              setIsModalOpen(false);
              refetch();
            },
            onError: (error) => {
              notify.error("Error", error.name);
            },
          }
        );
        setQuestion("");
        setAnswer("");
      } catch (error) {
        notify.error("Error saving FAQ:", error);
      }
    }
  };

  return (
    <>
      {!isModalOpen && (
        <Container>
          <div className="flex justify-between text-grey-40">
            <div className="text-grey-40">
              <Label size="large" weight="plus">
                Frequently Asked Questions
              </Label>
            </div>
            <div>
              <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                <PlusMini /> Add New FAQ
              </Button>
            </div>
          </div>
          <div className="flex mt-5">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Question</Table.HeaderCell>
                  <Table.HeaderCell>Answer</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {data?.faqs ? (
                <Table.Body>
                  {data.faqs.map((item: FAQ, index: number) => (
                    <Table.Row
                      key={index}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Table.Cell>{item.question}</Table.Cell>
                      <Table.Cell>{item.answer}</Table.Cell>
                      <Table.Cell>
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <Button variant="secondary" format="icon">
                              <EllipsisHorizontal />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              className="gap-x-2"
                              onClick={() => handleUpdateFaqs(item)}
                            >
                              <PencilSquare className="text-ui-fg-subtle" />
                              Edit
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                              className="gap-x-2"
                              onClick={() => handleDeleteFaq(item.id)}
                            >
                              <Trash className="text-ui-fg-subtle" />
                              Delete
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              ) : (
                <p>Data is not available.</p>
              )}
            </Table>
          </div>
        </Container>
      )}
      {isModalOpen && (
        <Container>
          <div>
            <Label size="large" weight="plus">
              FAQ
            </Label>
            <div className="mb-2">
              <Label size="base" weight="plus">
                Question
              </Label>
              <div className="w-[400px]">
                <Input
                  placeholder="Write Question ..."
                  id="question"
                  size="base"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Label size="base" weight="plus">
                Answer
              </Label>
              <Textarea
                placeholder="Write Answer ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className="mt-3 flex ">
              <Button onClick={handleAddFaqs}>
                {editedFAQ ? "Update" : "Add"}
              </Button>
              <div className="ml-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export const config: SettingConfig = {
  card: {
    label: "FAQs",
    description: "Manage frequently asked questions",
  },
};

export default StoreContacts;
