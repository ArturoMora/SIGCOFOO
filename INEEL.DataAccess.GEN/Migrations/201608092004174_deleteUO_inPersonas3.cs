namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteUO_inPersonas3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional");

            DropIndex("GEN.cat_Personas", new[] { "ClaveUnidad" });

        }
        
        public override void Down()
        {
        }
    }
}
