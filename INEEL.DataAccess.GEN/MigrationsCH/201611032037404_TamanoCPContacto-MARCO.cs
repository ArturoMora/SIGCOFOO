namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCPContactoMARCO : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("CR.cat_Contactos", "CP", c => c.String(maxLength: 10));
        }
        
        public override void Down()
        {
            //AlterColumn("CR.cat_Contactos", "CP", c => c.String(maxLength: 5));
        }
    }
}
