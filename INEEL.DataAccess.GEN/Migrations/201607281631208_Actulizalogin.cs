namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Actulizalogin : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "GEN.cat_Categorias", newName: "cat_Categoria");
            RenameColumn(table: "GEN.cat_Personas", name: "CveCategoria", newName: "CategoriaId");
            RenameColumn(table: "GEN.cat_Personas", name: "IdPlaza", newName: "PlazaId");
            RenameColumn(table: "GEN.cat_Personas", name: "TipoPersona", newName: "TipoPersonalId");
            RenameColumn(table: "GEN.cat_Personas", name: "IdUbicacion", newName: "UbicacionAreaId");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_CveCategoria", newName: "IX_CategoriaId");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_TipoPersona", newName: "IX_TipoPersonalId");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_IdUbicacion", newName: "IX_UbicacionAreaId");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_IdPlaza", newName: "IX_PlazaId");
            AddColumn("GEN.tab_AccesoSistema", "PasswordSha", c => c.Binary());
            AddColumn("GEN.cat_Personas", "ApellidoPaterno", c => c.String(maxLength: 100));
            AddColumn("GEN.cat_Funciones", "Nombre", c => c.String(maxLength: 100));
            DropColumn("GEN.tab_AccesoSistema", "Password");
            DropColumn("GEN.cat_Personas", "ApellidoPateno");
            DropColumn("GEN.cat_Categoria", "FechaEfectiva");
            DropColumn("GEN.cat_PlazaTrabajo", "FechaEfectiva");
            DropColumn("GEN.cat_RolPersona", "FechaEfectivaRol");
            DropColumn("GEN.cat_Roles", "FechaEfectiva");
            DropColumn("GEN.cat_UbicacionAreas", "FechaEfectiva");
            DropColumn("GEN.cat_Funciones", "Funcion");
            DropColumn("GEN.cat_Funciones", "FechaEfectiva");
            DropColumn("GEN.cat_FuncionesRol", "FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_FuncionesRol", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_Funciones", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_Funciones", "Funcion", c => c.String(maxLength: 100));
            AddColumn("GEN.cat_UbicacionAreas", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_Roles", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_RolPersona", "FechaEfectivaRol", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_PlazaTrabajo", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_Categoria", "FechaEfectiva", c => c.DateTime(nullable: false));
            AddColumn("GEN.cat_Personas", "ApellidoPateno", c => c.String(maxLength: 100));
            AddColumn("GEN.tab_AccesoSistema", "Password", c => c.String(maxLength: 10));
            DropColumn("GEN.cat_Funciones", "Nombre");
            DropColumn("GEN.cat_Personas", "ApellidoPaterno");
            DropColumn("GEN.tab_AccesoSistema", "PasswordSha");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_PlazaId", newName: "IX_IdPlaza");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_UbicacionAreaId", newName: "IX_IdUbicacion");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_TipoPersonalId", newName: "IX_TipoPersona");
            RenameIndex(table: "GEN.cat_Personas", name: "IX_CategoriaId", newName: "IX_CveCategoria");
            RenameColumn(table: "GEN.cat_Personas", name: "UbicacionAreaId", newName: "IdUbicacion");
            RenameColumn(table: "GEN.cat_Personas", name: "TipoPersonalId", newName: "TipoPersona");
            RenameColumn(table: "GEN.cat_Personas", name: "PlazaId", newName: "IdPlaza");
            RenameColumn(table: "GEN.cat_Personas", name: "CategoriaId", newName: "CveCategoria");
            RenameTable(name: "GEN.cat_Categoria", newName: "cat_Categorias");
        }
    }
}
