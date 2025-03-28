import { useState } from "react";
import { Button, Container, Input, Items, Modal } from "./components";

import {
  findContainerItems,
  findItemTitle,
  handleDragEnd,
  handleDragMove,
  handleDragStart,
  onAddContainer,
  onAddItem,
  onDeleteContainer,
  onEditContainer,
  onEditItem,
  openEditItemModal,
  openEditModal,
  useContainerStore,
  findContainerTitle,
  onDeleteItem,
  findContainerNameByItemId,
  isContainerNameEmpty,
  isItemNameEmpty,
  isEditingContainerNameChanged,
  isEditingItemNameChanged,
} from "./lib";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Layout, Text, Trash2 } from "lucide-react";

export default function App() {
  const [containerName, setContainerName] = useState("");
  const { containers, setContainers, addContainer } = useContainerStore();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditContainerModal, setShowEditContainerModal] = useState(false);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [itemName, setItemName] = useState("");
  const [editingContainer, setEditingContainer] =
    useState<UniqueIdentifier | null>(null);
  const [editingContainerName, setEditingContainerName] = useState("");

  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<UniqueIdentifier | null>(null);
  const [editingItemName, setEditingItemName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const containerNameForEditingItem = findContainerNameByItemId(
    containers,
    editingItem
  );

  return (
    <div className="mx-auto max-w-7xl">
      <Modal
        showModal={showAddContainerModal}
        setShowModal={setShowAddContainerModal}
      >
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-xl md:text-2xl font-bold text-center mx-auto">
            Agregar Contenedor
          </h1>
          <Input
            type="text"
            placeholder="Título del Contenedor"
            name="containername"
            value={containerName}
            onChange={(event) => setContainerName(event.target.value)}
          />
          <Button
            fullWidth={true}
            label="Agregar contenedor"
            onClick={() =>
              onAddContainer(
                containerName,
                setContainerName,
                setShowAddContainerModal,
                addContainer
              )
            }
            disabled={isContainerNameEmpty(containerName)}
          />
        </div>
      </Modal>
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-xl md:text-2xl font-bold text-center mx-auto">
            Agregar Tarjeta
          </h1>
          <Input
            type="text"
            placeholder="Título de la Tarjeta"
            name="card-name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />
          <Button
            fullWidth={true}
            label="Agregar Tarjeta"
            onClick={() =>
              onAddItem(
                itemName,
                setItemName,
                setShowAddItemModal,
                containers,
                setContainers,
                currentContainerId
              )
            }
            disabled={isItemNameEmpty(itemName)}
          />
        </div>
      </Modal>
      <Modal
        showModal={showEditContainerModal}
        setShowModal={setShowEditContainerModal}
      >
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-xl md:text-2xl font-bold text-center mx-auto">
            Editar Contenedor
          </h1>
          <Input
            type="text"
            placeholder="Título del Contenedor"
            name="containername"
            value={editingContainerName}
            onChange={(event) => setEditingContainerName(event.target.value)}
          />
          <Button
            fullWidth={true}
            label="Editar contenedor"
            onClick={() =>
              onEditContainer(
                editingContainerName,
                editingContainer,
                containers,
                setContainers,
                setEditingContainer,
                setEditingContainerName,
                setShowEditContainerModal
              )
            }
            disabled={
              !isEditingContainerNameChanged(
                editingContainerName,
                editingContainer,
                containers
              )
            }
          />
        </div>
      </Modal>
      <Modal showModal={showEditItemModal} setShowModal={setShowEditItemModal}>
        <div className="flex justify-between">
          <div className="flex items-start gap-3">
            <Layout size={18} className="mt-1" />
            <h1 className="leading-[1]">
              <span className="text-base font-semibold md:font-medium">
                Optimización
              </span>{" "}
              <br />
              <span className="text-sm text-gray-500">
                en la lista {containerNameForEditingItem}
              </span>
            </h1>
          </div>
          <Button
            bgLight={true}
            label=""
            icon={Trash2}
            onClick={() =>
              onDeleteItem(
                editingItem,
                containers,
                setContainers,
                setEditingItem,
                setShowEditItemModal
              )
            }
          />
        </div>

        <div className="mt-8">
          <div className="flex gap-3 mb-3">
            <Text size={18} className="mt-1" />
            <span className="text-base font-semibold md:font-medium">
              Título de la Tarjeta
            </span>{" "}
          </div>
          <Input
            type="text"
            placeholder="Título de la Tarjeta"
            name="card-name"
            value={editingItemName}
            onChange={(event) => setEditingItemName(event.target.value)}
          />{" "}
          <div className="flex justify-between w-full gap-3 mt-2">
            <Button
              bgLight={true}
              fullWidth={true}
              variant="ghost"
              label="Cancelar"
              onClick={() => setShowEditItemModal(false)}
            />
            <Button
              fullWidth={true}
              label="Guardar"
              onClick={() =>
                onEditItem(
                  editingItemName,
                  editingItem,
                  containers,
                  setContainers,
                  setEditingItem,
                  setShowEditItemModal
                )
              }
              disabled={
                !isEditingItemNameChanged(
                  editingItemName,
                  editingItem,
                  containers
                )
              }
            />
          </div>
        </div>
      </Modal>
      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-800 text-xl md:text-3xl font-bold">
          DragTrack
        </h1>
        <Button
          onClick={() => setShowAddContainerModal(true)}
          label="Agregar Contenedor"
        />
      </div>
      <div className="mt-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(event) => handleDragStart(event, setActiveId)}
            onDragMove={(event) =>
              handleDragMove(event, containers, setContainers)
            }
            onDragEnd={(event) =>
              handleDragEnd(event, containers, setContainers, setActiveId)
            }
          >
            <SortableContext items={containers.map((item) => item.id)}>
              {containers.map((container) => (
                <Container
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setCurrentContainerId(container.id);
                  }}
                  onEdit={() =>
                    openEditModal(
                      setEditingContainer,
                      setEditingContainerName,
                      setShowEditContainerModal,
                      container.id,
                      container.title
                    )
                  }
                  onDelete={() =>
                    onDeleteContainer(container.id, containers, setContainers)
                  }
                >
                  <SortableContext
                    items={container.items.map((item) => item.id)}
                  >
                    <div className="flex items-start flex-col gap-y-2">
                      {container.items.map((item) => (
                        <Items
                          title={item.title}
                          id={item.id}
                          key={item.id}
                          onEdit={() =>
                            openEditItemModal(
                              setEditingItem,
                              setEditingItemName,
                              setShowEditItemModal,
                              item.id,
                              item.title
                            )
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {activeId && activeId.toString().includes("item") && (
                <Items
                  id={activeId}
                  title={findItemTitle(containers, activeId)}
                />
              )}
              {activeId && activeId.toString().includes("container") && (
                <Container
                  id={activeId}
                  title={findContainerTitle(containers, activeId)}
                >
                  {findContainerItems(containers, activeId).map((item) => (
                    <Items key={item.id} title={item.title} id={item.id} />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
