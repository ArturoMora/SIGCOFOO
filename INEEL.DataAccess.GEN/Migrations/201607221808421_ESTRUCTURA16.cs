namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA16 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropPrimaryKey("GEN.cat_Personas");
            AlterColumn("GEN.tab_AccesoSistema", "ClavePersona", c => c.String(maxLength: 10));
            AlterColumn("GEN.cat_Personas", "ClavePersona", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("GEN.cat_Personas", "Correo", c => c.String(maxLength: 100));
            AlterColumn("GEN.cat_RolPersona", "ClavePersona", c => c.String(maxLength: 10));
            AddPrimaryKey("GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            CreateIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            CreateIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            AddForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            AddForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas");
            DropIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            DropPrimaryKey("GEN.cat_Personas");
            AlterColumn("GEN.cat_RolPersona", "ClavePersona", c => c.String(maxLength: 128));
            AlterColumn("GEN.cat_Personas", "Correo", c => c.String(maxLength: 20));
            AlterColumn("GEN.cat_Personas", "ClavePersona", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("GEN.tab_AccesoSistema", "ClavePersona", c => c.String(maxLength: 128));
            AddPrimaryKey("GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            CreateIndex("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            CreateIndex("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            AddForeignKey("GEN.tab_AccesoSistema", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
            AddForeignKey("GEN.cat_RolPersona", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" }, "GEN.cat_Personas", new[] { "ClavePersona", "RUPersona", "FechaEfectiva" });
        }
    }
}
