namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class unidad9 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID", "GEN.cat_TipoUnidad");
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "TipoUnidadO_TipoUnidadID" });
            RenameColumn(table: "GEN.cat_UnidadOrganizacional", name: "TipoUnidadO_TipoUnidadID", newName: "tipoO");
            AlterColumn("GEN.cat_UnidadOrganizacional", "tipoO", c => c.Int(nullable: false));
            CreateIndex("GEN.cat_UnidadOrganizacional", "tipoO");
            AddForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad", "TipoUnidadID", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_UnidadOrganizacional", "tipoO", "GEN.cat_TipoUnidad");
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "tipoO" });
            AlterColumn("GEN.cat_UnidadOrganizacional", "tipoO", c => c.Int());
            RenameColumn(table: "GEN.cat_UnidadOrganizacional", name: "tipoO", newName: "TipoUnidadO_TipoUnidadID");
            CreateIndex("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID");
            AddForeignKey("GEN.cat_UnidadOrganizacional", "TipoUnidadO_TipoUnidadID", "GEN.cat_TipoUnidad", "TipoUnidadID");
        }
    }
}
