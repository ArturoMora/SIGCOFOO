namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RelacionUnidadContacto : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.cat_Contactos", "ClaveUnidad", c => c.String(maxLength: 20));
            CreateIndex("CR.cat_Contactos", "ClaveUnidad");
            AddForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.cat_Contactos", "ClaveUnidad", "CR.UnidadOrganizacionalEmpresas");
            DropIndex("CR.cat_Contactos", new[] { "ClaveUnidad" });
            DropColumn("CR.cat_Contactos", "ClaveUnidad");
        }
    }
}
