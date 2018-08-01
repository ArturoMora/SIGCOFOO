namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class crMArco12Sep : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.Propuestas", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            //AddColumn("GEN.Propuestas", "ContactoId", c => c.Int());
            //CreateIndex("GEN.Propuestas", "ClaveUnidadEmpresa");
            //CreateIndex("GEN.Propuestas", "ContactoId");
            //AddForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos", "ContactoId");
            //AddForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
        
        public override void Down()
        {
            //DropForeignKey("GEN.Propuestas", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            //DropForeignKey("GEN.Propuestas", "ContactoId", "CR.cat_Contactos");
            //DropIndex("GEN.Propuestas", new[] { "ContactoId" });
            //DropIndex("GEN.Propuestas", new[] { "ClaveUnidadEmpresa" });
            //DropColumn("GEN.Propuestas", "ContactoId");
            //DropColumn("GEN.Propuestas", "ClaveUnidadEmpresa");
        }
    }
}
