namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA13 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.tab_AccesoSistema", "ClavePersona", "GEN.cat_Personas");
            DropForeignKey("GEN.cat_RolPersona", "ClavePersona", "GEN.cat_Personas");
            DropIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona" });
            DropIndex("GEN.cat_RolPersona", new[] { "ClavePersona" });
            DropPrimaryKey("GEN.cat_Personas");
           
            
            AddColumn("GEN.tab_AccesoSistema", "RUPersona", c => c.String(maxLength: 20));
            AddColumn("GEN.tab_AccesoSistema", "UserName", c => c.String(maxLength: 10));
            AddColumn("GEN.tab_AccesoSistema", "Password", c => c.String(maxLength: 10));
          
            AddColumn("GEN.cat_RolPersona", "RUPersona", c => c.String(maxLength: 20));
            AddColumn("GEN.cat_RolPersona", "FechaEfectivaRol", c => c.DateTime(nullable: false));
            AlterColumn("GEN.cat_Personas", "RUPersona", c => c.String(nullable: false, maxLength: 20));
            AddPrimaryKey("GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            CreateIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            CreateIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
          
             AddForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            AddForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropColumn("GEN.tab_AccesoSistema", "ClaveAcceso");
            DropColumn("GEN.tab_AccesoSistema", "contrasena");
        }
        
        public override void Down()
        {
            AddColumn("GEN.tab_AccesoSistema", "contrasena", c => c.String(maxLength: 10));
            AddColumn("GEN.tab_AccesoSistema", "ClaveAcceso", c => c.String(maxLength: 10));
            DropForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
             DropIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropPrimaryKey("GEN.cat_Personas");
            AlterColumn("GEN.cat_Personas", "RUPersona", c => c.String(maxLength: 20));
            DropColumn("GEN.cat_RolPersona", "FechaEfectivaRol");
            DropColumn("GEN.cat_RolPersona", "RUPersona");
            DropColumn("GEN.PersonalProyecto", "numEmpleado");
            DropColumn("GEN.tab_AccesoSistema", "Password");
            DropColumn("GEN.tab_AccesoSistema", "UserName");
            DropColumn("GEN.tab_AccesoSistema", "RUPersona");
         
            AddPrimaryKey("GEN.cat_Personas", "ClavePersona");
            CreateIndex("GEN.cat_RolPersona", "ClavePersona");
            CreateIndex("GEN.tab_AccesoSistema", "ClavePersona");
            AddForeignKey("GEN.cat_RolPersona", "ClavePersona", "GEN.cat_Personas", "ClavePersona");
            AddForeignKey("GEN.tab_AccesoSistema", "ClavePersona", "GEN.cat_Personas", "ClavePersona");
        }
    }
}
